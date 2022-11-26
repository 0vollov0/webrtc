import WebSocket, { WebSocketServer } from 'ws';
import { Room } from './Room';

interface BreakRoom extends Room {
  migrate: (ws: WebSocket.WebSocket, room: Room) => void;
}

export default class implements BreakRoom {
  userWsMap: Map<WebSocket.WebSocket, string>;
  id: string;
  constructor() {
    this.userWsMap = new Map<WebSocket.WebSocket, string>();
    this.id = "nomad group";
  }
  join(ws: WebSocket.WebSocket, userId: string) {
    this.userWsMap.set(ws, userId);
  }
  exit(ws: WebSocket.WebSocket) {
    return this.userWsMap.delete(ws);
  }
  migrate(ws: WebSocket.WebSocket, room?: Room) {
    if(!room) return;
    const userId = this.userWsMap.get(ws);
    if (!userId) return;
    room.join(ws, userId);
    this.exit(ws);
  }
}