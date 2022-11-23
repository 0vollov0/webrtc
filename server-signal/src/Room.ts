import { Signal } from 'common';
import WebSocket, { WebSocketServer } from 'ws';

export default class {
  userWsMap: Map<WebSocket.WebSocket, string>;

  constructor() {
    this.userWsMap = new Map<WebSocket.WebSocket, string>();
  }

  connect(ws: WebSocket.WebSocket, userId: string) {
    this.userWsMap.set(ws, userId);
  }

  disconnect(ws: WebSocket.WebSocket) {
    this.userWsMap.delete(ws);
  }

  sendSignalToAll(except: WebSocket.WebSocket, signal: Signal) {
    const encode = JSON.stringify(signal);
    this.userWsMap.forEach((_, ws) => {
      if (ws !== except) ws.send(encode);
    })
  }
}