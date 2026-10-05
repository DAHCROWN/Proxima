"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { socket } from "@/src/ws/socket";
import type { VoiceSignal } from "@/src/ws/events";

type Peer = {
	pc: RTCPeerConnection;
	// ICE candidates that arrived before the remote description was set.
	pending: RTCIceCandidateInit[];
};

// No STUN/TURN: on a LAN, devices reach each other through their host
// candidates, so calls work with no internet connection at all.
const RTC_CONFIG: RTCConfiguration = { iceServers: [] };

/**
 * Mesh voice channel for the current room: every participant holds one
 * peer connection to every other. Fine for the small groups a LAN room has.
 */
export function useVoiceChannel() {
	const [joined, setJoined] = useState(false);
	const [muted, setMuted] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [remoteStreams, setRemoteStreams] = useState<
		Record<string, MediaStream>
	>({});

	const localStream = useRef<MediaStream | null>(null);
	const peers = useRef(new Map<string, Peer>());

	const closePeer = useCallback((id: string) => {
		peers.current.get(id)?.pc.close();
		peers.current.delete(id);
		setRemoteStreams(({ [id]: _, ...rest }) => rest);
	}, []);

	const createPeer = useCallback(
		(id: string): Peer => {
			const pc = new RTCPeerConnection(RTC_CONFIG);
			const stream = localStream.current;
			stream?.getTracks().forEach((track) => pc.addTrack(track, stream));

			pc.onicecandidate = (e) => {
				if (e.candidate) {
					socket.emit("voice:signal", { to: id, candidate: e.candidate.toJSON() });
				}
			};
			pc.ontrack = (e) => {
				setRemoteStreams((s) => ({ ...s, [id]: e.streams[0] }));
			};
			pc.onconnectionstatechange = () => {
				if (pc.connectionState === "failed") closePeer(id);
			};

			const peer = { pc, pending: [] };
			peers.current.set(id, peer);
			return peer;
		},
		[closePeer],
	);

	useEffect(() => {
		// We just joined: dial everyone already in the channel.
		async function onPeers(peerIds: string[]) {
			for (const id of peerIds) {
				const { pc } = createPeer(id);
				await pc.setLocalDescription(await pc.createOffer());
				socket.emit("voice:signal", {
					to: id,
					description: pc.localDescription!.toJSON(),
				});
			}
		}

		async function onSignal({ from, description, candidate }: VoiceSignal & { from: string }) {
			if (!localStream.current) return;
			let peer = peers.current.get(from);
			if (!peer && description?.type === "offer") peer = createPeer(from);
			if (!peer) return;
			const { pc } = peer;

			try {
				if (description) {
					await pc.setRemoteDescription(description);
					for (const queued of peer.pending) await pc.addIceCandidate(queued);
					peer.pending = [];
					if (description.type === "offer") {
						await pc.setLocalDescription(await pc.createAnswer());
						socket.emit("voice:signal", {
							to: from,
							description: pc.localDescription!.toJSON(),
						});
					}
				}
				if (candidate) {
					if (pc.remoteDescription) await pc.addIceCandidate(candidate);
					else peer.pending.push(candidate);
				}
			} catch (err) {
				console.error("Voice signalling failed", err);
			}
		}

		socket.on("voice:peers", onPeers);
		socket.on("voice:signal", onSignal);
		socket.on("voice:peer-left", closePeer);
		return () => {
			socket.off("voice:peers", onPeers);
			socket.off("voice:signal", onSignal);
			socket.off("voice:peer-left", closePeer);
		};
	}, [createPeer, closePeer]);

	const join = useCallback(async () => {
		setError(null);
		if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
			setError(
				"Microphone needs HTTPS. Open Proxima via its https:// address (run `pnpm cert` on the host).",
			);
			return;
		}
		try {
			localStream.current = await navigator.mediaDevices.getUserMedia({
				audio: { echoCancellation: true, noiseSuppression: true },
			});
		} catch {
			setError("Microphone access was blocked. Allow it and try again.");
			return;
		}
		setMuted(false);
		setJoined(true);
		socket.emit("voice:join");
	}, []);

	const leave = useCallback(() => {
		if (!localStream.current) return;
		socket.emit("voice:leave");
		for (const id of [...peers.current.keys()]) closePeer(id);
		localStream.current.getTracks().forEach((t) => t.stop());
		localStream.current = null;
		setJoined(false);
	}, [closePeer]);

	const toggleMute = useCallback(() => {
		const next = !muted;
		localStream.current?.getAudioTracks().forEach((t) => {
			t.enabled = !next;
		});
		setMuted(next);
	}, [muted]);

	// Hang up when the room view unmounts.
	useEffect(() => leave, [leave]);

	return { joined, muted, error, remoteStreams, join, leave, toggleMute };
}
