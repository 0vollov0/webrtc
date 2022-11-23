import WebSocket, { WebSocketServer } from 'ws';
import { Signal, isSignal } from 'common';
import { IncomingMessage } from 'http';
import Room from './Room';

const room = new Room();

const wss = new WebSocketServer({
  port: 8080
})

const getUserId = (req: IncomingMessage) => {
  if (!req.url) return null;
  const url = new URL(req.url, "ws://localhost:8080");
  const userId = url.searchParams.get("userId");
  return userId;
}


wss.on('connection', (ws, req) => {
  console.log('connect');
  const userId = getUserId(req);
  if (!userId) return;
  room.connect(ws, userId);

  ws.on('message',(data, isBinary) => {
    const dataString = data.toString();
    try {
      const signal: Signal = JSON.parse(dataString);
      if (!isSignal(signal)) throw new Error("the data received isn't signal type");
      switch (signal.type) {
        case "offer":
          room.sendSignalToAll(ws, signal);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  })
  ws.on('close',(code, reason) => {
  })
})