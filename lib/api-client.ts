/**
 * Fetch available chat rooms from the backend
 * @returns Array of available chat rooms
 */
export async function fetchAvailableChatRooms(): Promise<Array<{ id: string; name: string }>> {
  // TODO: Implement API call to backend
  // Expected endpoint: GET /api/rooms
  // Expected response: { rooms: Array<{ id: string, name: string }> }
  const response = await fetch("/api/rooms")
  if (!response.ok) {
    throw new Error("Failed to fetch chat rooms")
  }
  const data = await response.json()
  return data.rooms
}

/**
 * Join a chat room
 * @param roomId - The ID of the chat room
 * @param username - The username of the user
 * @returns Session information
 */
export async function joinChatRoomAPI(roomId: string, username: string): Promise<{ sessionId: string }> {
  // TODO: Implement API call to backend
  // Expected endpoint: POST /api/rooms/{roomId}/join
  // Expected body: { username: string }
  // Expected response: { sessionId: string }
  const response = await fetch(`/api/rooms/${roomId}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  })
  if (!response.ok) {
    throw new Error("Failed to join chat room")
  }
  return response.json()
}

/**
 * Leave a chat room
 * @param roomId - The ID of the chat room
 * @param username - The username of the user
 */
export async function leaveChatRoomAPI(roomId: string, username: string): Promise<void> {
  // TODO: Implement API call to backend
  // Expected endpoint: POST /api/rooms/{roomId}/leave
  // Expected body: { username: string }
  const response = await fetch(`/api/rooms/${roomId}/leave`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  })
  if (!response.ok) {
    throw new Error("Failed to leave chat room")
  }
}
