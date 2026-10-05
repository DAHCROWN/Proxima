// Socket.io event contract shared by the server (src/ws/server.ts) and the
// browser client (src/ws/socket.ts).

export type Member = {
	id: string;
	name: string;
	roomId: number;
	inVoice: boolean;
};

export type ChatPayload = {
	id: string;
	message: string;
	roomId: number;
	name: string;
	time: string;
};

/** One WebRTC negotiation step relayed between two voice peers. */
export type VoiceSignal = {
	description?: RTCSessionDescriptionInit;
	candidate?: RTCIceCandidateInit;
};

export interface ServerToClientEvents {
	"user-connected": (name: string) => void;
	"user-disconnected": (name: string) => void;
	"chat-message": (payload: ChatPayload) => void;
	"room-members": (members: Member[]) => void;
	/** Sent to a peer joining voice: everyone already in the channel. */
	"voice:peers": (peerIds: string[]) => void;
	"voice:peer-left": (peerId: string) => void;
	"voice:signal": (signal: VoiceSignal & { from: string }) => void;
}

export interface ClientToServerEvents {
	"new-user": (name: string, roomId: number) => void;
	"send-chat-message": (message: string, id: string) => void;
	"voice:join": () => void;
	"voice:leave": () => void;
	"voice:signal": (signal: VoiceSignal & { to: string }) => void;
}
