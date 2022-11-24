import WebSocket, { WebSocketServer } from 'ws';
import Room, { IRoom } from './Room';

interface INomadGroup extends IRoom {
  migrate: (ws: WebSocket.WebSocket, room: Room) => void;
}

export default class implements INomadGroup {
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