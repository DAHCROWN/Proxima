import { roomManager } from "@/lib/room-manager";

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const { username } = await request.json();
		const chatRoomId = Number(id);

		if (!username || typeof username !== "string") {
			return Response.json({ error: "Invalid username" }, { status: 400 });
		}

		const room = await roomManager.getRoom(chatRoomId);
		if (!room) {
			return Response.json({ error: "Room not found" }, { status: 404 });
		}

		// Add user to room
		await roomManager.addUser(chatRoomId, username);

		return Response.json({
			success: true,
			room: {
				id: room.id,
				name: room.name,
			},
			messages: roomManager.getMessages(chatRoomId),
			users: roomManager.getUsers(chatRoomId),
		});
	} catch (error) {
		console.error("Error joining room:", error);
		return Response.json({ error: "Failed to join room" }, { status: 500 });
	}
}
