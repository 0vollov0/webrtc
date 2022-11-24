import WebSocket, { WebSocketServer } from 'ws';
import { Signal, isSignal } from 'common';
import { IncomingMessage } from 'http';
import Room from './Room';
import NomadGroup from './NomadGroup';

const nomadGroup = new NomadGroup();
const roomMap = new Map<string, Room>();

const wss = new WebSocketServer({
  port: 8080
})

const getUserId = (req: IncomingMessage) => {
  if (!req.url) return null;
  const url = new URL(req.url, "ws://localhost:8080");
  const userId = url.searchParams.get("userId");
  return userId;
}

const onClose = (ws: WebSocket.WebSocket) => {
  const result = nomadGroup.exit(ws);
  if (result) return;
  const rooms = Array.from(roomMap.values());
  for (const id in rooms) {
    if (Object.prototype.hasOwnProperty.call(rooms, id)) {
      const room = rooms[id];
      if (room.exit(ws)) break;
    }
  }
}

const roomCleaner = (id: string) => {
  roomMap.delete(id);
}

wss.on('connection', (ws, req) => {
  const userId = getUserId(req);
  if (!userId) return;
  nomadGroup.join(ws, userId);

  ws.on('message',(data, isBinary) => {
    const dataString = data.toString();
    try {
      const signal: Signal = JSON.parse(dataString);
      if (!isSignal(signal)) throw new Error("the data received isn't signal type");
      switch (signal.type) {
        case "offer":
          roomMap.set(signal.roomId, new Room(signal.roomId, roomCleaner));
          nomadGroup.migrate(ws, roomMap.get(signal.roomId));
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  })
  ws.on('close',() => onClose(ws))
})