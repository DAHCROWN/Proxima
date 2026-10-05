"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, LogOut } from "lucide-react";
import "dotenv/config";
import { IMessage, IRoom } from "@/lib/types";
import { socket } from "@/src/ws/socket";
import { v4 as uuidv4 } from "uuid";

interface ChatSession {
	room: IRoom;
	username: string;
}

interface ChatInterfaceProps {
	session: ChatSession;
	onLeave: () => void;
}

export default function ChatInterface({
	session,
	onLeave,
}: ChatInterfaceProps) {
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [inputValue, setInputValue] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [isConnected, setIsConnected] = useState(socket.connected);

	useEffect(() => {
		function onConnect() {
			setIsConnected(true);
		}
		function onDisconnect() {
			setIsConnected(false);
		}

		function onChatMessage(message: any) {
			console.log("New Message", message);
			const newMessage: IMessage = {
				id: message.id,
				createdAt: message.time,
				roomId: message.roomId,
				author: message.name,
				userId: null,
				message: message.message,
			};
			setMessages((prevMessages) => [...prevMessages, newMessage]);
		}

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		socket.on("chat-message", onChatMessage);

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.off("chat-message", onChatMessage);
		};
	}, [session.room.id, session.room.name]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!inputValue.trim()) return;
		try {
			// console.log("User message", inputValue);
			socket.emit("send-chat-message", inputValue);
			const newMessage: IMessage = {
				id: uuidv4().toString(),
				createdAt: new Date().toISOString(),
				roomId: session.room.id,
				author: session.username,
				userId: null,
				message: inputValue,
			};

			setMessages((prevMessages) => [...prevMessages, newMessage]);
			setInputValue("");
		} catch (err) {
			setError("Failed to send message");
			console.error("Error sending message:", err);
		}
	};

	return (
		<div className="flex flex-col h-screen bg-background">
			{/* Header */}
			<div className="border-b border-border bg-card px-6 py-4">
				<div className="flex items-center justify-between max-w-4xl mx-auto">
					<div>
						<h1 className="text-2xl font-bold text-foreground">
							{session.room.name}
						</h1>
						<p className="text-sm text-muted-foreground">
							Joined as {session.username}
						</p>
					</div>
					<Button
						onClick={() => {
							socket.off("disconnect");
						}}
						variant="outline"
						size="sm"
						className="gap-2 bg-transparent"
					>
						<LogOut className="w-4 h-4" />
						Leave
					</Button>
				</div>
			</div>

			{/* Messages Container */}
			<div className="flex-1 overflow-y-auto px-6 py-4">
				<div className="max-w-4xl mx-auto space-y-4">
					{loading && (
						<div className="text-center py-8">
							<p className="text-muted-foreground">Connecting to chat...</p>
						</div>
					)}

					{error && (
						<Card className="p-4 bg-destructive/10 border-destructive/20">
							<p className="text-destructive text-sm">{error}</p>
						</Card>
					)}

					{messages.length === 0 && !loading && (
						<div className="text-center py-12">
							<p className="text-muted-foreground">
								No messages yet. Start the conversation!
							</p>
						</div>
					)}

					{messages.map((message) => (
						<div
							key={message.id}
							className={`flex ${
								message.author === session.username
									? "justify-end"
									: "justify-start"
							}`}
						>
							<div
								className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
									message.author === session.username
										? "bg-primary text-primary-foreground"
										: "bg-muted text-foreground"
								}`}
							>
								{message.author !== session.username && (
									<p className="text-xs font-semibold mb-1 opacity-75">
										{message.author}
									</p>
								)}
								<p className="break-words">{message.message}</p>
								<p className="text-xs mt-1 opacity-70">
									{new Date(message.createdAt).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</p>
							</div>
						</div>
					))}
					<div ref={messagesEndRef} />
				</div>
			</div>

			{/* Message Input */}
			<div className="border-t border-border bg-card px-6 py-4">
				<form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
					<div className="flex gap-2">
						<Input
							type="text"
							placeholder="Type a message..."
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							disabled={loading || !isConnected}
							className="flex-1"
						/>
						<Button
							type="submit"
							disabled={loading || !inputValue.trim() || !isConnected}
							className="bg-primary hover:bg-primary/90 gap-2"
						>
							<Send className="w-4 h-4" />
							<span className="hidden sm:inline">Send</span>
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

async function connectToRoom(
	roomId: string,
	username: string
): Promise<WebSocket> {
	return new Promise((resolve, reject) => {
		try {
			const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
			const wsUrl = `${protocol}//${
				window.location.host
			}/api/ws?roomId=${roomId}&username=${encodeURIComponent(username)}`;
			const ws = new WebSocket(wsUrl);

			ws.onopen = () => {
				resolve(ws);
			};

			ws.onerror = () => {
				reject(new Error("WebSocket connection failed"));
			};
		} catch (error) {
			reject(error);
		}
	});
}

async function leaveChatRoom(roomId: Number, username: string): Promise<void> {
	try {
		const response = await fetch(`/api/rooms/${roomId}/leave`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username }),
		});
		if (!response.ok) throw new Error("Failed to leave room");
	} catch (error) {
		console.error("Error leaving room:", error);
		throw error;
	}
}
