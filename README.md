# Local Chat Rooms – Realtime Simple Chat App (Next.js + WebSockets)

## Overview

This is a Next.js/TypeScript enhancement of the original Realtime Simple Chat App. It supports multiple dynamic chat rooms, real WebSocket connections, persistent chat data, and a modern UI built with React and Radix UI.

---

## Features
- Create, join, and chat in multiple rooms
- Real-time messages over WebSocket (socket.io)
- Persistent storage via Drizzle ORM, SQLite
- User join/leave notifications
- Modern, minimal UI
- Room and message management on backend

---

## Project Structure
```
local-chat-rooms/
├── app/                 # Next.js application (pages, API routes)
│   ├── api/             # API endpoints for rooms
│   ├── layout.tsx       # Global layout (UI, fonts)
│   └── page.tsx         # Main page UI, routing state
├── components/          # React components (RoomDiscovery, JoinRoom, ChatInterface, UI library)
├── lib/                 # RoomManager logic and API utilities
├── src/ws/              # WebSocket server (server.ts) and socket utils
├── src/db/              # Database schema and connection (Drizzle ORM, SQLite)
├── public/              # Static assets and placeholder images
├── styles/              # Global CSS (Tailwind, etc.)
├── package.json         # Project config, dependencies, scripts
├── pnpm-lock.yaml       # pnpm lockfile
└── ...
```

---

## Main Components
- **Frontend** (Next.js, React)
  - `app/page.tsx` – Main UI logic: state, navigation between discovery, join, and chat
  - `components/room-discovery.tsx` – Room list, discover and select rooms
  - `components/join-room.tsx` – Input to join under a username
  - `components/chat-interface.tsx` – Actual chat UI, message display & input
  - `components/ui/` – Radix-based UI elements
- **Backend**
  - `src/ws/server.ts` – WebSocket server (socket.io), runs with `pnpm ws` for real-time events
  - `lib/room-manager.ts` – Chat room and message handlers (uses Drizzle ORM to SQLite)
  - `src/db/schema.ts` – Database schema

---

## Setup & Development

1. **Install dependencies:**
   ```sh
   pnpm install
   ```

2. **Set up environment:**
    - Ensure SQLite DB or set the correct DB connection in `.env`

3. **Database (optional, for seed data):**
   ```sh
   pnpm db:seed
   ```

4. **Run Next.js frontend:**
   ```sh
   pnpm dev
   ```

5. **Start WebSocket server:** (**Required for chat functionality**)
   ```sh
   pnpm ws
   ```
   This runs `tsx watch src/ws/server.ts`. Make sure your `.env` sets the correct `WS_PORT` (default: 3001) and that you don't have port conflicts.

6. **Access the app:**
   - Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts
- `pnpm dev` – Starts Next.js UI in dev mode
- `pnpm ws` – Starts/reloads the websocket server (`src/ws/server.ts`)
- `pnpm db:seed` – Seeds the database with sample chat rooms/messages/users (see `src/db/seed.ts`)

---

## Dependencies
- Next.js, React, TypeScript, Tailwind CSS
- @radix-ui components for accessible UI
- socket.io, socket.io-client
- Drizzle ORM, SQLite, dotenv
- tsx (for TypeScript node server)

---

## Additional Notes
- For the legacy version, see files in the root directory (simple single-room demo with `index.html` and `server.js`).
- The local-chat-rooms/ app is the advanced, multi-room, modernized implementation.
- **Ensure to always run `pnpm ws` in parallel with the Next.js dev server for full functionality!**
