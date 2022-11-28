import { Signal, SignalAnswer } from 'common';
import WebSocket, { WebSocketServer } from 'ws';
import { Room } from './Room';

export interface ChatRoom extends Room {
  roomCleaner: (id: string) => void;
  // owner: WebSocket.WebSocket | undefined;
  // offer: RTCSessionDescriptionInit | undefined;
}

export default class implements ChatRoom {
  id: string;
  userWsMap: Map<WebSocket.WebSocket, string>;
  roomCleaner: (id: string) => void;

  constructor(id: string, roomCleaner: (id: string) => void, owner?: WebSocket.WebSocket) {
    this.id = id;
    this.userWsMap = new Map<WebSocket.WebSocket, string>();
    this.roomCleaner = roomCleaner;
  }

  join(ws: WebSocket.WebSocket, userId: string) {
    this.userWsMap.set(ws, userId);
    this.sendResponse(ws);
  }

  exit(ws: WebSocket.WebSocket) {
    const result = this.userWsMap.delete(ws);
    if (this.userWsMap.size === 0) this.roomCleaner(this.id);
    return result;
  }

  sendSignalToAll(signal: Signal) {
    const encode = JSON.stringify(signal);
    this.userWsMap.forEach((_, ws) => ws.send(encode));
  }

  sendResponse(ws: WebSocket.WebSocket) {
    const signal: Signal = {
      type: 'ResponseRoom',
      roomId: this.id
    }
    const encode = JSON.stringify(signal);
    ws.send(encode);
  }

  sendOffer(sender: WebSocket.WebSocket, offer: RTCSessionDescriptionInit) {
    // sendOffer should be able to send offer to all except sender
    // fix it
    const signal: Signal = {
      type: 'Offer',
      roomId: this.id,
      data: offer
    }
    const encode = JSON.stringify(signal);
    Array.from(this.userWsMap.keys())
      .filter((ws) => ws !== sender)
      .forEach((ws) => ws.send(encode))
  }

  sendAnswer(sender: string, answer: RTCSessionDescriptionInit) {
    const signal: SignalAnswer = {
      type: 'Answer',
      roomId: this.id,
      data: answer,
      sender,
    }
    const encode = JSON.stringify(signal);
    Array.from(this.userWsMap.entries()).find(([ws, userId]) => userId === sender)?.[0].send(encode);
  }

}