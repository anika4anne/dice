import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

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

class WebSocketService {
  private socket: Socket | null = null;
  private roomCode: string | null = null;
  private playerId: number | null = null;

  connect() {
    this.socket = io('wss://anika4anne.hackclub.app:34277');
    
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  joinRoom(roomCode: string, playerName: string, isHost: boolean, roomData?: Partial<RoomData>) {
    if (!this.socket) return;

    this.roomCode = roomCode;
    this.socket.emit('join_room', {
      roomCode,
      playerName,
      isHost,
      ...roomData
    });
  }

  updateRoom(roomData: RoomData) {
    if (!this.socket || !this.roomCode) return;

    this.socket.emit('update_room', {
      roomCode: this.roomCode,
      roomData
    });
  }

  sendChatMessage(message: string, playerName: string, isSystemMessage = false) {
    if (!this.socket || !this.roomCode) return;

    this.socket.emit('chat_message', {
      roomCode: this.roomCode,
      message: {
        playerName,
        message,
        isSystemMessage
      }
    });
  }

  leaveRoom() {
    if (!this.socket || !this.roomCode) return;

    this.socket.emit('leave_room');
    this.roomCode = null;
    this.playerId = null;
  }

  onRoomJoined(callback: (data: { room: RoomData; playerId: number }) => void) {
    if (!this.socket) return;
    this.socket.on('room_joined', callback);
  }

  onRoomUpdated(callback: (data: { room: RoomData }) => void) {
    if (!this.socket) return;
    this.socket.on('room_updated', callback);
  }

  onPlayerJoined(callback: (data: { room: RoomData }) => void) {
    if (!this.socket) return;
    this.socket.on('player_joined', callback);
  }

  onPlayerLeft(callback: (data: { room: RoomData }) => void) {
    if (!this.socket) return;
    this.socket.on('player_left', callback);
  }

  onChatMessage(callback: (data: { message: { id: string; playerName: string; message: string; timestamp: number; isSystemMessage?: boolean } }) => void) {
    if (!this.socket) return;
    this.socket.on('chat_message', callback);
  }

  onError(callback: (data: { message: string }) => void) {
    if (!this.socket) return;
    this.socket.on('error', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.roomCode = null;
    this.playerId = null;
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
