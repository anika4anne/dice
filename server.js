// @ts-nocheck

const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: process.env.PORT || 3001 });

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

          if (!rooms.has(roomCode)) {
            if (isHost) {
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
            } else {
              ws.send(
                JSON.stringify({ type: "error", message: "Room not found" }),
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
    if (
      client.currentRoom === roomCode &&
      client.readyState === WebSocket.OPEN
    ) {
      client.send(JSON.stringify(message));
    }
  });
}

console.log(`WebSocket server running on port ${process.env.PORT || 3001}`);
console.log(
  "To connect from your game, use: wss://anika4anne.hackclub.app:3001",
);
