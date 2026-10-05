import { chatMessages, chatRooms } from "@/src/db/schema";

export type IRoom = typeof chatRooms.$inferSelect;


export type IMessage  = typeof chatMessages.$inferSelect

type MessageType = 'chat' | 'media'
