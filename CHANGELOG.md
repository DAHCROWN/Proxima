# Changelog

Notable changes to Proxima. Newest first. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added
- `CLAUDE.md` with working agreements and testing notes for agent sessions.
- `.claude/launch.json` preview config.
- `NO_TLS=1` forces plain HTTP even when `certs/` exists.

### Fixed
- Next no longer picks the home directory as the workspace root
  (`turbopack.root`).

## 2026-10-05

### Added
- Voice channel per room: peer-to-peer WebRTC audio for any number of
  participants, with join, leave and mute. Works offline on the LAN.
- Live member list and "online" count per room.
- `pnpm cert` generates a self-signed certificate for this machine's LAN
  address; the server switches to HTTPS when it exists (needed for
  microphone access on other devices).
- Typed socket event contract shared by client and server (`src/ws/events.ts`).

### Changed
- Renamed the project to **Proxima** (repo `DAHCROWN/Proxima`).
- Next.js and socket.io now run in one process on one port (`server.ts`).
  `pnpm dev` starts everything; `pnpm ws` is gone.
- Standardised on pnpm (pinned via `packageManager`, npm/yarn blocked).
- App moved from `local-chat-rooms/` to the repo root.

### Fixed
- Members are removed from rooms when they disconnect.
- Chat messages are relayed with their ids.
- Other devices on the network can connect (CORS allowed localhost only).
- The Leave button now leaves the room.

### Removed
- The original single-room vanilla socket.io starter.
- `local.db` is no longer tracked in git.

## 2025-10-28 – 2025-10-30

### Added
- Next.js rewrite with multiple chat rooms, socket.io messaging and a
  Drizzle/SQLite schema.

## 2025-09-17

- Initial repo: single-room socket.io chat.
