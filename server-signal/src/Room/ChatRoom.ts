import { Signal } from 'common';
import WebSocket, { WebSocketServer } from 'ws';
import { Room } from './Room';

export interface ChatRoom extends Room {
  owner: WebSocket.WebSocket | undefined;
  roomCleaner: (id: string) => void;
  offer: RTCSessionDescriptionInit | undefined;
}

export default class implements ChatRoom {
  id: string;
  userWsMap: Map<WebSocket.WebSocket, string>;
  roomCleaner: (id: string) => void;
  owner: WebSocket.WebSocket | undefined;
  offer: RTCSessionDescriptionInit | undefined;

  constructor(id: string, roomCleaner: (id: string) => void, owner?: WebSocket.WebSocket) {
    this.id = id;
    this.userWsMap = new Map<WebSocket.WebSocket, string>();
    this.roomCleaner = roomCleaner;
    this.owner = owner;
  }

  join(ws: WebSocket.WebSocket, userId: string) {
    if (this.userWsMap.size === 0) this.owner = ws;
    this.userWsMap.set(ws, userId);
  }

  exit(ws: WebSocket.WebSocket) {
    const result = this.userWsMap.delete(ws);
    if (this.userWsMap.size === 0) this.roomCleaner(this.id);
    return result;
  }

  sendSignalToAll(signal: Signal<any>) {
    const encode = JSON.stringify(signal);
    this.userWsMap.forEach((_, ws) => {
      if (ws !== this.owner) ws.send(encode);
    })
  }

  setOffer(offer: RTCSessionDescriptionInit) {
    this.offer = offer;
  }

  setOwner(owner: WebSocket.WebSocket) {
    this.owner = owner;
  }
}