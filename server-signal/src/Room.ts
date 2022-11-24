import { Signal } from 'common';
import WebSocket, { WebSocketServer } from 'ws';

export interface IRoom {
  id: string;
  userWsMap: Map<WebSocket.WebSocket, string>;
  join: (ws: WebSocket.WebSocket, userId: string) => void;
  exit: (ws: WebSocket.WebSocket) => boolean;
  roomCleaner?: (id: string) => void;
}

export default class implements IRoom {
  id: string;
  userWsMap: Map<WebSocket.WebSocket, string>;
  roomCleaner: (id: string) => void;

  constructor(id: string, roomCleaner: (id: string) => void) {
    this.id = id;
    this.userWsMap = new Map<WebSocket.WebSocket, string>();
    this.roomCleaner = roomCleaner;
  }

  join(ws: WebSocket.WebSocket, userId: string) {
    this.userWsMap.set(ws, userId);
  }

  exit(ws: WebSocket.WebSocket) {
    const result = this.userWsMap.delete(ws);
    if (this.userWsMap.size === 0) this.roomCleaner(this.id);
    return result;
  }

  sendSignalToAll(except: WebSocket.WebSocket, signal: Signal) {
    const encode = JSON.stringify(signal);
    this.userWsMap.forEach((_, ws) => {
      if (ws !== except) ws.send(encode);
    })
  }
}