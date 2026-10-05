# Proxima — TODO

Working list. Move items to [CHANGELOG.md](CHANGELOG.md) when they ship.

## Now

- [ ] Test a voice call between two real devices over HTTPS (`pnpm cert`).
      Only signalling was verified so far (in-browser tabs, fake mic).
- [ ] UI/UX overhaul — see below.

## UI/UX

- [ ] Design direction: layout, type, colour, dark mode, mobile-first
- [ ] Room list: member and voice counts per room, empty state
- [ ] Create a room from the UI (only `GET /api/rooms` exists today)
- [ ] Chat: grouped messages, timestamps, join/leave notices in the stream
- [ ] Voice: speaking indicator, per-person mute/volume, connection state
- [ ] Push-to-talk mode (hold Space / hold button), carried over from walkie-talkie
- [ ] Remember username between visits
- [ ] First-run help for the certificate warning on other devices

## Features

- [ ] File sharing over the LAN (WebRTC data channels, peer to peer)
- [ ] Streams: screen share / camera in a room
- [ ] Media library: browse and play shared media
- [ ] Persist chat: socket messages are never saved — wire `roomManager.addMessage`
      into the socket server and load history on join
- [ ] Room discovery on the LAN (mDNS, e.g. `proxima.local`)
- [ ] Access control: anyone on the network can connect today

## Tech debt

- [ ] Fix pre-existing type errors (`app/api/rooms/[id]/leave/route.ts`, `src/db/seed.ts`)
      and remove `typescript.ignoreBuildErrors` from `next.config.mjs`
- [ ] Remove unused `/api/rooms/[id]/join` and `/leave` routes, or use them
- [ ] Mesh voice scales poorly past ~6 people; consider an SFU if rooms grow
- [ ] Add tests for the socket server (rooms, members, signalling relay)
