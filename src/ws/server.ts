import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import type {
	ClientToServerEvents,
	Member,
	ServerToClientEvents,
} from "./events";

// Everyone currently connected, keyed by socket id.
const members = new Map<string, Member>();

const roomKey = (roomId: number) => `room:${roomId}`;
const membersOf = (roomId: number) =>
	[...members.values()].filter((m) => m.roomId === roomId);

/**
 * Attaches the chat + voice signalling server to the app's HTTP(S) server.
 * Voice audio itself flows peer-to-peer over WebRTC; this only relays the
 * offers, answers and ICE candidates needed to set those connections up.
 */
export function attachSocketServer(httpServer: HttpServer) {
	const io = new Server<ClientToServerEvents, ServerToClientEvents>(
		httpServer,
		// Leave non-socket.io upgrades (Next's HMR) for Next to handle.
		{ destroyUpgrade: false },
	);

	const broadcastMembers = (roomId: number) =>
		io.to(roomKey(roomId)).emit("room-members", membersOf(roomId));

	io.on("connection", (socket) => {
		const leaveVoice = (member: Member) => {
			if (!member.inVoice) return;
			member.inVoice = false;
			socket.to(roomKey(member.roomId)).emit("voice:peer-left", socket.id);
		};

		socket.on("new-user", (name, roomId) => {
			members.set(socket.id, { id: socket.id, name, roomId, inVoice: false });
			socket.join(roomKey(roomId));
			socket.to(roomKey(roomId)).emit("user-connected", name);
			broadcastMembers(roomId);
		});

		socket.on("send-chat-message", (message, id) => {
			const member = members.get(socket.id);
			if (!member) return;
			socket.to(roomKey(member.roomId)).emit("chat-message", {
				id,
				message,
				roomId: member.roomId,
				name: member.name,
				time: new Date().toISOString(),
			});
		});

		socket.on("voice:join", () => {
			const member = members.get(socket.id);
			if (!member || member.inVoice) return;
			// The newcomer dials everyone already in the channel, so existing
			// peers only ever answer — no offer collisions.
			const peerIds = membersOf(member.roomId)
				.filter((m) => m.inVoice)
				.map((m) => m.id);
			member.inVoice = true;
			socket.emit("voice:peers", peerIds);
			broadcastMembers(member.roomId);
		});

		socket.on("voice:leave", () => {
			const member = members.get(socket.id);
			if (!member) return;
			leaveVoice(member);
			broadcastMembers(member.roomId);
		});

		socket.on("voice:signal", ({ to, ...signal }) => {
			const from = members.get(socket.id);
			const target = members.get(to);
			// Only relay between two voice members of the same room.
			if (!from?.inVoice || !target?.inVoice) return;
			if (from.roomId !== target.roomId) return;
			io.to(to).emit("voice:signal", { ...signal, from: socket.id });
		});

		socket.on("disconnect", () => {
			const member = members.get(socket.id);
			if (!member) return;
			leaveVoice(member);
			members.delete(socket.id);
			socket.to(roomKey(member.roomId)).emit("user-disconnected", member.name);
			broadcastMembers(member.roomId);
		});
	});

	return io;
}
