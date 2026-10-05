"use client";

import { useEffect, useRef } from "react";
import { Mic, MicOff, PhoneCall, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoiceChannel } from "@/hooks/use-voice-channel";
import type { Member } from "@/src/ws/events";

function RemoteAudio({ stream }: { stream: MediaStream }) {
	const ref = useRef<HTMLAudioElement>(null);
	useEffect(() => {
		if (ref.current) ref.current.srcObject = stream;
	}, [stream]);
	return <audio ref={ref} autoPlay />;
}

export default function VoicePanel({ members }: { members: Member[] }) {
	const { joined, muted, error, remoteStreams, join, leave, toggleMute } =
		useVoiceChannel();
	const inVoice = members.filter((m) => m.inVoice);

	return (
		<div className="border-b border-border bg-card/50 px-6 py-3">
			<div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
				<div className="flex min-w-0 items-center gap-2 text-sm">
					<span
						className={`h-2 w-2 shrink-0 rounded-full ${
							inVoice.length ? "bg-green-500" : "bg-muted-foreground/40"
						}`}
					/>
					<span className="truncate text-muted-foreground">
						{inVoice.length
							? `In voice: ${inVoice.map((m) => m.name).join(", ")}`
							: "Voice channel is empty"}
					</span>
				</div>

				<div className="flex items-center gap-2">
					{joined ? (
						<>
							<Button
								variant="outline"
								size="sm"
								onClick={toggleMute}
								aria-pressed={muted}
								className="gap-2 bg-transparent"
							>
								{muted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
								{muted ? "Unmute" : "Mute"}
							</Button>
							<Button variant="destructive" size="sm" onClick={leave} className="gap-2">
								<PhoneOff className="h-4 w-4" />
								Leave voice
							</Button>
						</>
					) : (
						<Button size="sm" onClick={join} className="gap-2">
							<PhoneCall className="h-4 w-4" />
							Join voice
						</Button>
					)}
				</div>
			</div>

			{error ? (
				<p className="mx-auto mt-2 max-w-4xl text-sm text-destructive">{error}</p>
			) : null}

			{Object.entries(remoteStreams).map(([id, stream]) => (
				<RemoteAudio key={id} stream={stream} />
			))}
		</div>
	);
}
