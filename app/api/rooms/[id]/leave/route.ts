import { roomManager } from "@/lib/room-manager"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { username } = await request.json()

    if (!username || typeof username !== "string") {
      return Response.json({ error: "Invalid username" }, { status: 400 })
    }

    roomManager.removeUser(id, username)

    return Response.json({
      success: true,
      users: roomManager.getUsers(id),
    })
  } catch (error) {
    console.error("Error leaving room:", error)
    return Response.json({ error: "Failed to leave room" }, { status: 500 })
  }
}
