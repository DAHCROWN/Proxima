import { roomManager } from "@/lib/room-manager";

export async function GET() {
	try {
		const rooms = await roomManager.getRooms();
		// console.log("List of Rooms (API):", rooms);
		return Response.json({ rooms });
	} catch (error) {
		console.error("Error fetching rooms:", error);
		return Response.json({ error: "Failed to fetch rooms" }, { status: 500 });
	}
}
