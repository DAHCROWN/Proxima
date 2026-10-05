import "dotenv/config";
import { existsSync, readFileSync } from "node:fs";
import { createServer as createHttpServer } from "node:http";
import { createServer as createHttpsServer } from "node:https";
import { networkInterfaces } from "node:os";
import next from "next";
import { attachSocketServer } from "./src/ws/server";

// One process, one port: Next.js pages + the socket.io chat/voice server.
// Serving both from the same origin means one certificate and no CORS,
// which is what makes the app usable from other devices on the LAN.

const dev = process.env.NODE_ENV !== "production";
const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || "0.0.0.0";

// Browsers only grant microphone access on HTTPS (or localhost), so LAN
// clients need TLS. `pnpm cert` writes a self-signed pair to certs/.
const keyPath = "certs/key.pem";
const certPath = "certs/cert.pem";
const tls = existsSync(keyPath) && existsSync(certPath);

const app = next({ dev, hostname: host, port });
const handle = app.getRequestHandler();

async function main() {
	await app.prepare();

	const server = tls
		? createHttpsServer(
				{ key: readFileSync(keyPath), cert: readFileSync(certPath) },
				handle,
			)
		: createHttpServer(handle);

	attachSocketServer(server);

	const upgrade = app.getUpgradeHandler();
	server.on("upgrade", (req, socket, head) => {
		if (!req.url?.startsWith("/socket.io")) upgrade(req, socket, head);
	});

	server.listen(port, host, () => {
		const scheme = tls ? "https" : "http";
		const lan = Object.values(networkInterfaces())
			.flat()
			.filter((i) => i?.family === "IPv4" && !i.internal)
			.map((i) => `${scheme}://${i!.address}:${port}`);
		console.log(`> Proxima ready on ${scheme}://localhost:${port}`);
		for (const url of lan) console.log(`> On your network: ${url}`);
		if (!tls) {
			console.log(
				"> No certs found — voice works on localhost only. Run `pnpm cert` for LAN calls.",
			);
		}
	});
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
