export interface Player {
  id: number;
  name: string;
  isHost: boolean;
  score: number;
  dice: number[];
  isCurrentTurn: boolean;
  rollsLeft: number;
  color: string;
  icon?: string;
}

export interface RoomData {
  players: Player[];
  totalRounds: number;
  gameMode: string;
  diceType: string;
  gameStarted: boolean;
  currentRound: number;
  currentPlayerIndex: number;
  roundScores: Record<number, number>[];
  chatMessages?: Array<{
    id: string;
    playerName: string;
    message: string;
    timestamp: number;
    isSystemMessage?: boolean;
  }>;
}

type WebSocketMessage =
  | { type: "room_joined"; room: RoomData; playerId: number }
  | { type: "room_updated"; room: RoomData }
  | { type: "player_joined"; room: RoomData }
  | { type: "player_left"; room: RoomData }
  | {
      type: "chat_message";
      message: {
        id: string;
        playerName: string;
        message: string;
        timestamp: number;
        isSystemMessage?: boolean;
      };
    }
  | { type: "error"; message: string };

class WebSocketService {
  private socket: WebSocket | null = null;
  private roomCode: string | null = null;
  private playerId: number | null = null;
  private eventListeners = new Map<string, Array<(data: unknown) => void>>();

  connect() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return;
    }

    this.socket = new WebSocket("wss://anika4anne.hackclub.app:34277");

    this.socket.onopen = () => {
      console.log("✅ Connected to WebSocket server");
    };

    this.socket.onclose = () => {
      console.log("❌ Disconnected from WebSocket server");
    };

    this.socket.onerror = (error) => {
      console.error("🔴 WebSocket error:", error);
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string) as WebSocketMessage;
        this.handleMessage(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
  }

  private handleMessage(data: WebSocketMessage) {
    console.log("📨 Received WebSocket message:", data.type, data);
    const { type, ...payload } = data;
    const listeners = this.eventListeners.get(type as string) ?? [];
    console.log(`🎯 Found ${listeners.length} listeners for event: ${type}`);
    listeners.forEach((callback) => callback(payload));
  }

  private addEventListener(type: string, callback: (data: unknown) => void) {
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, []);
    }
    const listeners = this.eventListeners.get(type);
    if (listeners) {
      listeners.push(callback);
    }
  }

  joinRoom(
    roomCode: string,
    playerName: string,
    isHost: boolean,
    roomData?: Partial<RoomData>,
  ) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error("🚫 Cannot join room: WebSocket not connected");
      return;
    }

    console.log(
      `🚪 Joining room: ${roomCode} as ${playerName} (host: ${isHost})`,
    );
    this.roomCode = roomCode;
    const message = {
      type: "join_room",
      roomCode,
      playerName,
      isHost,
      ...roomData,
    };
    console.log("📤 Sending join room message:", message);
    this.socket.send(JSON.stringify(message));
  }

  updateRoom(roomData: RoomData) {
    if (
      !this.socket ||
      this.socket.readyState !== WebSocket.OPEN ||
      !this.roomCode
    )
      return;

    this.socket.send(
      JSON.stringify({
        type: "update_room",
        roomCode: this.roomCode,
        roomData,
      }),
    );
  }

  sendChatMessage(
    message: string,
    playerName: string,
    isSystemMessage = false,
  ) {
    if (
      !this.socket ||
      this.socket.readyState !== WebSocket.OPEN ||
      !this.roomCode
    )
      return;

    this.socket.send(
      JSON.stringify({
        type: "chat_message",
        roomCode: this.roomCode,
        message: {
          playerName,
          message,
          isSystemMessage,
        },
      }),
    );
  }

  leaveRoom() {
    if (
      !this.socket ||
      this.socket.readyState !== WebSocket.OPEN ||
      !this.roomCode
    )
      return;

    this.socket.send(
      JSON.stringify({
        type: "leave_room",
      }),
    );
    this.roomCode = null;
    this.playerId = null;
  }

  onRoomJoined(callback: (data: { room: RoomData; playerId: number }) => void) {
    this.addEventListener("room_joined", (data) =>
      callback(data as { room: RoomData; playerId: number }),
    );
  }

  onRoomUpdated(callback: (data: { room: RoomData }) => void) {
    this.addEventListener("room_updated", (data) =>
      callback(data as { room: RoomData }),
    );
  }

  onPlayerJoined(callback: (data: { room: RoomData }) => void) {
    this.addEventListener("player_joined", (data) =>
      callback(data as { room: RoomData }),
    );
  }

  onPlayerLeft(callback: (data: { room: RoomData }) => void) {
    this.addEventListener("player_left", (data) =>
      callback(data as { room: RoomData }),
    );
  }

  onChatMessage(
    callback: (data: {
      message: {
        id: string;
        playerName: string;
        message: string;
        timestamp: number;
        isSystemMessage?: boolean;
      };
    }) => void,
  ) {
    this.addEventListener("chat_message", (data) =>
      callback(
        data as {
          message: {
            id: string;
            playerName: string;
            message: string;
            timestamp: number;
            isSystemMessage?: boolean;
          };
        },
      ),
    );
  }

  onError(callback: (data: { message: string }) => void) {
    this.addEventListener("error", (data) =>
      callback(data as { message: string }),
    );
  }

  disconnect() {
    if (this.socket) {
      this.socket.onclose = null;
      this.socket.onmessage = null;
      this.socket.onerror = null;
      this.socket.close();
      this.socket = null;
    }
    this.roomCode = null;
    this.playerId = null;
    this.eventListeners.clear();
  }

  setPlayerId(id: number) {
    this.playerId = id;
  }

  getPlayerId() {
    return this.playerId;
  }

  getRoomCode() {
    return this.roomCode;
  }
}

export const webSocketService = new WebSocketService();
