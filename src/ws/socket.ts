import { io, type Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "./events";

// Same origin as the page (see server.ts), so this works from any device on
// the LAN and over HTTPS without extra configuration.
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
	autoConnect: false,
});
