import { Signal, AnswerSignal, OfferSignal, ResponseRoomSignal, IcecandidateSignal } from 'common';
import WebSocket from 'ws';
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
    this.sendResponse(ws);
    this.userWsMap.set(ws, userId);
  }

  exit(ws: WebSocket.WebSocket) {
    const result = this.userWsMap.delete(ws);
    if (this.userWsMap.size === 0) this.roomCleaner(this.id);
    return result;
  }

  sendSignalToAll(signal: Signal) {
    const encoded = JSON.stringify(signal);
    this.userWsMap.forEach((_, ws) => ws.send(encoded));
  }

  sendResponse(ws: WebSocket.WebSocket) {
    const signal: ResponseRoomSignal = {
      type: 'ResponseRoom',
      roomId: this.id,
      participants: Array.from(this.userWsMap.values())
    }
    const encoded = JSON.stringify(signal);
    ws.send(encoded);
  }

  sendOffer(signal: OfferSignal) {
    if (!signal.data) return;
    const encoded = JSON.stringify(signal);
    this.sendToUser(signal.receiver, encoded);
  }

  sendAnswer(signal: AnswerSignal) {
    if (!signal.data) return;
    const encoded = JSON.stringify(signal);
    this.sendToUser(signal.receiver, encoded);
  }

  sendIcecandidate(signal: IcecandidateSignal) {
    if (!signal.data) return;
    const encoded = JSON.stringify(signal);
    this.sendToUser(signal.receiver, encoded); 
  }

  sendToUser(receiver: string, encoded: string) {
    Array.from(this.userWsMap.entries()).find(([ws, userId]) => userId === receiver)?.[0].send(encoded);
  }

  findUserId(ws: WebSocket.WebSocket) {
    return this.userWsMap.get(ws);
  }
}