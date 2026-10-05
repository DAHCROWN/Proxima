import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
	id: int("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull().unique(),
	createdAt: text("created_at")
		.default(sql`(current_timestamp)`)
		.notNull(),
	updatedAt: text("updated_at")
		.default(sql`(current_timestamp)`)
		.notNull(),
});

export const chatRooms = sqliteTable("chat_rooms", {
	id: int("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull().unique(),
	createdAt: text("created_at")
		.default(sql`(current_timestamp)`)
		.notNull(),
	updatedAt: text("updated_at")
		.default(sql`(current_timestamp)`)
		.notNull(),
});

export const chatMessages = sqliteTable("chat_messages", {
	id: text().primaryKey(),
	roomId: int("room_id").references(() => chatRooms.id),
	author: text("username").references(() => users.name),
	userId: int("user_id").references(() => users.id),
	message: text("message").notNull(),
	createdAt: text("created_at")
		.default(sql`(current_timestamp)`)
		.notNull(),
});

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
	room: one(chatRooms, {
		fields: [chatMessages.roomId],
		references: [chatRooms.id],
	}),
	user: one(users, {
		fields: [chatMessages.userId],
		references: [users.id],
	}),
}));

export const usersRelations = relations(users, ({ many }) => ({
	chatMessages: many(chatMessages),
}));

export const chatRoomsRelations = relations(chatRooms, ({ many }) => ({
	chatMessages: many(chatMessages),
}));
