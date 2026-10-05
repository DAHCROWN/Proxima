import { db } from "@/src/db";
import { chatRooms, chatMessages } from "@/src/db/schema";
import { eq } from "drizzle-orm";

class RoomManager {
	constructor() {}

	async createRoom(name: string) {
		try {
			const result = await db.insert(chatRooms).values({ name }).returning();
			return result[0];
		} catch (error) {
			console.error("Error creating chat room:", error);
			throw error;
		}
	}

	async getRooms(): Promise<{ id: number; name: string }[]> {
		try {
			console.log("Getting rooms from database");
			const rooms = await db.query.chatRooms.findMany();
			console.log("List of Rooms:", rooms);
			return rooms;
		} catch (error) {
			console.error("Error fetching rooms:", error);
			throw error;
		}
	}

	async getRoom(roomId: number) {
		const room = await db.query.chatRooms.findFirst({
			where: eq(chatRooms.id, roomId),
		});
		return room;
	}

	async addMessage(roomId: number, userId: number, text: string) {
		try {
			const result = await db
				.insert(chatMessages)
				.values({
					id: "",
					roomId,
					userId,
					message: text,
				})
				.returning();
			return result[0];
		} catch (error) {
			console.error("Error adding message:", error);
			throw error;
		}
	}

	async getMessages(roomId: number) {
		const messages = await db.query.chatMessages.findMany({
			where: eq(chatMessages.roomId, roomId),
		});
		return messages;
	}

	async addUser(roomId: number, username: string) {
		console.warn("addUser not implemented - requires room_users table.");
		return false;
	}

	async removeUser(roomId: number, username: string) {
		console.warn("removeUser not implemented - requires room_users table.");
		return false;
	}

	async getUsers(roomId: number) {
		console.warn("getUsers not implemented - requires room_users table.");
		return [];
	}
}

export const roomManager = new RoomManager();
