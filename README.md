# Proxima

Chat rooms and voice calls for everyone on the same local network. No
internet connection or cloud service required — one machine runs Proxima,
everyone else opens it in a browser.

## Features

- Multiple chat rooms with live messages (socket.io) and SQLite persistence
- Live member list per room
- **Voice channel per room** — peer-to-peer WebRTC audio, mute, any number
  of participants (mesh, best for small groups)

## Running it

```sh
pnpm install
pnpm db:seed   # optional sample rooms
pnpm dev
```

The terminal prints a localhost URL and one URL per network interface.

### Voice over the LAN

Browsers only allow microphone access on HTTPS (or `localhost`). To call from
other devices, generate a certificate for this machine's LAN address once:

```sh
pnpm cert            # or: pnpm cert 192.168.1.20
pnpm dev             # now serves https://
```

Each device shows a certificate warning the first time; accept it to continue.

## How it fits together

`server.ts` runs Next.js and the socket.io server in one process on one port
(default 3000, `PORT` to change). Same origin means one certificate and no CORS.

| Path | Role |
| --- | --- |
| `server.ts` | HTTP(S) server: Next.js pages + socket.io |
| `src/ws/server.ts` | Rooms, members, chat relay, voice signalling |
| `src/ws/events.ts` | Typed socket event contract (client + server) |
| `hooks/use-voice-channel.ts` | WebRTC mesh: offers, answers, ICE, mute |
| `components/voice-panel.tsx` | Join / leave / mute UI and remote audio |
| `src/db/` | Drizzle schema and SQLite connection |

Voice audio never touches the server: it only relays the WebRTC handshake.
The newest participant dials everyone already in the channel, so peers never
send competing offers.

## Scripts

- `pnpm dev` — app + socket server (restart after editing `server.ts` or `src/ws/`)
- `pnpm cert` — self-signed certificate for LAN HTTPS
- `pnpm start` — production mode (run `pnpm build` first)
- `pnpm db:seed` — sample rooms and messages

pnpm is required (`packageManager` is pinned; npm and yarn installs are blocked).

## Project notes

- [TODO.md](TODO.md) — what's next
- [CHANGELOG.md](CHANGELOG.md) — what shipped
