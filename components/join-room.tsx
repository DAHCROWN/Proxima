"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import "dotenv/config";
import { io, Socket } from "socket.io-client";
import { IRoom } from "@/lib/types";
import { socket } from "@/src/ws/socket";

interface JoinRoomProps {
	room: IRoom;
	onJoin: (username: string) => void;
}

export default function JoinRoom({ room, onJoin }: JoinRoomProps) {
	const [username, setUsername] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!username.trim()) {
			setError("Please enter a username");
			return;
		}

		try {
			setLoading(true);
			setError(null);

			// Emit WS message
			socket.connect();
			socket.emit("new-user", username, room.id);
			onJoin(username);
		} catch (err) {
			setError("Failed to join room. Please try again.");
			console.error("Error joining room:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
			<div className="w-full max-w-md">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-foreground mb-2">
						Join {room.name}
					</h1>
					<p className="text-muted-foreground">
						Enter your username to join the chat
					</p>
				</div>

				<Card className="p-8">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label
								htmlFor="username"
								className="block text-sm font-medium text-foreground mb-2"
							>
								Username
							</label>
							<Input
								id="username"
								type="text"
								placeholder="Enter your username"
								value={username}
								onChange={(e) => {
									setUsername(e.target.value);
									setError(null);
								}}
								disabled={loading}
								maxLength={50}
								className="w-full"
							/>
						</div>

						{error && <p className="text-sm text-destructive">{error}</p>}

						<Button
							type="submit"
							disabled={loading || !username.trim()}
							className="w-full bg-primary hover:bg-primary/90"
						>
							{loading ? "Joining..." : "Join Room"}
						</Button>
					</form>
				</Card>
			</div>
		</div>
	);
}

async function joinChatRoom(roomId: string, username: string): Promise<void> {
	try {
		const response = await fetch(`/api/rooms/${roomId}/join`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username }),
		});
		if (!response.ok) throw new Error("Failed to join room");
	} catch (error) {
		console.error("Error joining room:", error);
		throw error;
	}
}
