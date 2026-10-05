"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { IRoom } from "@/lib/types";



interface RoomDiscoveryProps {
	onRoomSelect: (room: IRoom) => void;
}

export default function RoomDiscovery({ onRoomSelect }: RoomDiscoveryProps) {
	const [rooms, setRooms] = useState<IRoom[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchRooms = async () => {
			try {
				setLoading(true);
				setError(null);
				const availableRooms = await getAvailableChatRooms();
				console.log("Available rooms:", availableRooms);
				setRooms(availableRooms);
			} catch (err) {
				setError("Failed to load chat rooms. Please try again.");
				console.error("Error fetching rooms:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchRooms();
	}, []);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
			<div className="w-full max-w-2xl">
				<div className="mb-12 text-center">
					<h1 className="text-4xl font-bold text-foreground mb-2">
						Chat Rooms
					</h1>
					<p className="text-muted-foreground text-lg">
						Select a room to join the conversation
					</p>
				</div>

				{loading && (
					<div className="flex flex-col items-center justify-center py-12">
						<Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
						<p className="text-muted-foreground">Loading chat rooms...</p>
					</div>
				)}

				{error && (
					<Card className="p-6 bg-destructive/10 border-destructive/20">
						<p className="text-destructive text-center">{error}</p>
					</Card>
				)}

				{!loading && !error && rooms.length === 0 && (
					<Card className="p-12 text-center">
						<p className="text-muted-foreground text-lg">
							No chat rooms available at the moment
						</p>
					</Card>
				)}

				{!loading && !error && rooms.length > 0 && (
					<div className="grid gap-4">
						{rooms.map((room) => (
							<Card
								key={room.id}
								className="p-6 hover:bg-accent/50 transition-colors cursor-pointer"
								onClick={() => onRoomSelect(room)}
							>
								<div className="flex items-center justify-between">
									<div>
										<h2 className="text-xl font-semibold text-foreground">
											{room.name}
										</h2>
										<p className="text-sm text-muted-foreground mt-1">
											ID: {room.id}
										</p>
									</div>
									<Button
										onClick={(e) => {
											e.stopPropagation();
											onRoomSelect(room);
										}}
										className="bg-primary hover:bg-primary/90"
									>
										Join
									</Button>
								</div>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

async function getAvailableChatRooms(): Promise<IRoom[]> {
	try {
		const response = await fetch("/api/rooms");
		if (!response.ok) throw new Error("Failed to fetch rooms");
		const data = await response.json();
		return data.rooms;
	} catch (error) {
		console.error("Error fetching rooms:", error);
		throw error;
	}
}
