# Realtime Simple Chat App

This is a bare-bones real-time chat application built with Node.js and Socket.IO. It provides a minimal example of how to implement a live chat system with a simple frontend and backend.

## Features

- Real-time messaging between users
- User join/leave notifications
- Minimal UI for demonstration purposes

## Project Structure

```
/Realtime-Simple-Chat-App-master
├── index.html        # Frontend HTML and inline CSS
├── script.js         # Frontend JavaScript (handles chat logic)
├── server.js         # Backend Node.js server using Socket.IO
├── package.json      # Project metadata and dependencies
├── package-lock.json # Dependency lock file
```

## How It Works

### Backend (`server.js`)

- Starts a Socket.IO server on port 3000.
- Maintains a list of connected users.
- Listens for:
  - `new-user`: Registers a new user and notifies others.
  - `send-chat-message`: Broadcasts chat messages to all users except the sender.
  - `disconnect`: Notifies others when a user leaves.

### Frontend (`index.html` & `script.js`)

- Connects to the Socket.IO server.
- Prompts the user for their name.
- Displays chat messages and user connection/disconnection events.
- Allows users to send messages via a form.
- Uses basic inline CSS for layout.

## Getting Started

1. **Install dependencies:**
   ```bash
   pnpm install
   ```
2. **Start the server:**
   ```bash
   pnpm devStart
   ```
3. **Open the app:**
   - Open `index.html` in your browser (ensure the server is running on `localhost:3000`).

## Dependencies

- [socket.io](https://socket.io/) (server-side)
- [nodemon](https://nodemon.io/) (development only)

## Future Plans

- **UI Improvements:**
  - Enhance the frontend design for a better user experience.
- **React Rewrite:**
  - Rebuild the frontend using React for maintainability and scalability.
  - Prepare the codebase for deployment as a mobile app using React Native.
  - Implement Image sharing
  - Call over LAN
