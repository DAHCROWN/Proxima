import { io } from "socket.io-client";

//* Connect WebSocket
const url = `http://localhost:5001`;
console.log("Websocket URL: ", url);
export const socket = io(url, { autoConnect: false });
