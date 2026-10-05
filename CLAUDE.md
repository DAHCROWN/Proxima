# Proxima

LAN-first chat rooms and voice calls: one machine runs the server, everyone
on the same network joins from a browser. Next up: file sharing, streams /
media, and a UI/UX overhaul. See README.md for setup and architecture.

## Working agreements

- **pnpm only.** `packageManager` is pinned and npm/yarn are blocked. Disk
  space on this machine is tight, so avoid installing heavy dependencies
  without asking.
- **Keep TODO.md and CHANGELOG.md current.** When something ships, tick or
  remove it in TODO.md and add it under `[Unreleased]` in CHANGELOG.md, in the
  same commit.
- Commit and push only when asked. The remote is `DAHCROWN/Proxima` (branch `main`).
- Code style: tabs, double quotes, small focused components. Match the
  surrounding code.

## Commands

- `pnpm dev`: Next.js plus socket.io in one process (`server.ts`). Restart it
  after editing `server.ts` or `src/ws/`, which hot reload doesn't cover.
- `pnpm cert`: self-signed cert in `certs/`. With it the server serves HTTPS,
  which LAN devices need for microphone access.
- `NO_TLS=1 pnpm dev`: force HTTP. The `.claude/launch.json` preview uses
  this because the browser pane can't trust the self-signed cert.
- Typecheck: `npx tsc --noEmit -p .`. There are 3 known pre-existing errors
  (leave route, seed script), and `next.config.mjs` ignores type errors at
  build, so run tsc yourself.

## Architecture in brief

- `src/ws/events.ts` is the typed socket contract. Change it first, and
  server and client both follow.
- `src/ws/server.ts` holds in-memory members (`Map` by socket id), the chat
  relay and the voice signalling relay. It only relays between voice members
  of the same room.
- `hooks/use-voice-channel.ts` runs a WebRTC mesh with no ICE servers (LAN
  host candidates). The newest participant sends the offers, so existing peers
  only answer.
- `lib/room-manager.ts` and `/api/rooms/*` handle Drizzle/SQLite rooms.
  Chat messages are **not** persisted yet (see TODO).

## Testing voice in the browser pane

The pane blocks the microphone and hides host IPs behind `.local` mDNS names,
so calls signal but never connect there. To exercise signalling, stub the mic
in each tab before clicking "Join voice":

```js
navigator.mediaDevices.getUserMedia = async () => {
	const ctx = new AudioContext();
	const d = ctx.createMediaStreamDestination();
	const o = ctx.createOscillator();
	o.connect(d);
	o.start();
	return d.stream;
};
```

You can only confirm real audio on two physical devices over HTTPS. That test
is still outstanding.

## History

- The walkie-talkie prototype that inspired voice was third-party code with no
  licence. Voice was reimplemented and none of its code is used.
- The project was renamed from Simple-Websocket-ChatApp / local-chat-rooms on
  2026-10-05.
