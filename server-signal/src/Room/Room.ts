import WebSocket, { WebSocketServer } from 'ws';

export interface Room {
  id: string;
  userWsMap: Map<WebSocket.WebSocket, string>;
  join: (ws: WebSocket.WebSocket, userId: string) => void;
  exit: (ws: WebSocket.WebSocket) => boolean;
}