// @ts-nocheck
const { WebSocketServer } = require("ws");
const http = require("http");

const server = http.createServer();
const wss = new WebSocketServer({ noServer: true });

const PORT = process.env.PORT || 34277;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    "To connect from your game, use: wss://" +
      (process.env.HOST || "localhost"),
  );
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

const rooms = new Map();

wss.on("connection", (ws) => {
  let currentRoom = null;
  let playerId = null;

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);

      switch (data.type) {
        case "join_room":
          const { roomCode, playerName, isHost } = data;

          if (
            !roomCode ||
            typeof roomCode !== "string" ||
            roomCode.length !== 6 ||
            !/^[A-Z0-9]{6}$/.test(roomCode)
          ) {
            ws.send(
              JSON.stringify({
                type: "error",
                message:
                  "Invalid room code. Must be exactly 6 characters (letters and numbers only).",
              }),
            );
            return;
          }

          if (!rooms.has(roomCode)) {
            if (isHost) {
              console.log(`🏠 Creating new room: ${roomCode}`);
              rooms.set(roomCode, {
                players: [
                  {
                    id: Date.now(),
                    name: playerName,
                    isHost: true,
                    score: 0,
                    dice: [1, 1, 1, 1, 1],
                    isCurrentTurn: false,
                    rollsLeft: 3,
                    color: "#FCD34D",
                  },
                ],
                totalRounds: data.totalRounds || 5,
                gameMode: data.gameMode || "classic",
                diceType: data.diceType || "6-sided",
                gameStarted: false,
                currentRound: 1,
                currentPlayerIndex: 0,
                roundScores: [],
                chatMessages: [],
              });
              console.log(`✅ Room ${roomCode} created successfully`);
            } else {
              console.log(
                `❌ Player ${playerName} tried to join non-existent room: ${roomCode}`,
              );
              ws.send(
                JSON.stringify({
                  type: "error",
                  message: `Room "${roomCode}" does not exist. Please check the room code or ask the host to create the room first.`,
                }),
              );
              return;
            }
          }

          const room = rooms.get(roomCode);
          if (room.players.length >= 6) {
            ws.send(JSON.stringify({ type: "error", message: "Room is full" }));
            return;
          }

          if (!isHost) {
            const newPlayer = {
              id: Date.now(),
              name: playerName,
              isHost: false,
              score: 0,
              dice: [1, 1, 1, 1, 1],
              isCurrentTurn: false,
              rollsLeft: 3,
              color: "#3B82F6",
            };
            room.players.push(newPlayer);
            playerId = newPlayer.id;
          } else {
            playerId = room.players[0].id;
          }

          currentRoom = roomCode;
          ws.currentRoom = roomCode;

          ws.send(
            JSON.stringify({ type: "room_joined", room: room, playerId }),
          );

          broadcastToRoom(roomCode, { type: "player_joined", room: room });
          break;

        case "update_room":
          const { roomCode: updateRoomCode, roomData } = data;
          if (rooms.has(updateRoomCode)) {
            rooms.set(updateRoomCode, roomData);
            broadcastToRoom(updateRoomCode, {
              type: "room_updated",
              room: roomData,
            });
          }
          break;

        case "chat_message":
          const { roomCode: chatRoomCode, message } = data;
          if (rooms.has(chatRoomCode)) {
            const room = rooms.get(chatRoomCode);
            const chatMessage = {
              id: Date.now().toString(),
              playerName: message.playerName,
              message: message.message,
              timestamp: Date.now(),
              isSystemMessage: message.isSystemMessage,
            };
            room.chatMessages.push(chatMessage);
            broadcastToRoom(chatRoomCode, {
              type: "chat_message",
              message: chatMessage,
            });
          }
          break;

        case "leave_room":
          if (currentRoom && playerId) {
            const room = rooms.get(currentRoom);
            if (room) {
              room.players = room.players.filter((p) => p.id !== playerId);
              if (room.players.length === 0) {
                rooms.delete(currentRoom);
              } else {
                broadcastToRoom(currentRoom, {
                  type: "player_left",
                  room: room,
                });
              }
            }
            currentRoom = null;
            playerId = null;
          }
          break;
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  ws.on("close", () => {
    if (currentRoom && playerId) {
      const room = rooms.get(currentRoom);
      if (room) {
        room.players = room.players.filter((p) => p.id !== playerId);
        if (room.players.length === 0) {
          rooms.delete(currentRoom);
        } else {
          broadcastToRoom(currentRoom, { type: "player_left", room: room });
        }
      }
    }
  });
});

function broadcastToRoom(roomCode, message) {
  wss.clients.forEach((client) => {
    if (client.currentRoom === roomCode && client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
}

setInterval(() => {
  if (rooms.size > 0) {
    console.log(`📊 Active rooms: ${rooms.size}`);
    rooms.forEach((room, code) => {
      console.log(
        `  🏠 ${code}: ${room.players.length}/6 players, ${room.gameStarted ? "Game in progress" : "Waiting for players"}`,
      );
    });
  } else {
    console.log(`📊 No active rooms`);
  }
}, 30000);

setInterval(() => {
  let cleanedCount = 0;
  for (const [code, room] of rooms.entries()) {
    if (room.players.length === 0) {
      rooms.delete(code);
      cleanedCount++;
      console.log(`🧹 Cleaned up empty room: ${code}`);
    }
  }
  if (cleanedCount > 0) {
    console.log(`🧹 Cleaned up ${cleanedCount} empty rooms`);
  }
}, 300000);
