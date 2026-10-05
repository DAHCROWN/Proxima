import { db } from ".";
import { chatRooms, users, chatMessages } from "./schema";

const main = async () => {
	try {
		console.log("Seeding database...");

        //! If to clear the database
		// await db.delete(chatRooms);
		// await db.delete(users);
		// await db.delete(chatMessages);

        await db.insert(users).values({
            name: "John Doe",
        });

        await db.insert(chatRooms).values({
            name: "General",
        });

        await db.insert(chatMessages).values({
            roomId: 1,
            userId: 1,
            message: "Hello, world!",
        });
        
        
		console.log("Database seeded successfully");
	} catch (error) {
		console.error("Error seeding database:", error);
		process.exit(1);
	}
};
