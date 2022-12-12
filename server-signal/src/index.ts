import WebSocket, { WebSocketServer } from 'ws';
import { Signal, isSignal, AnswerSignal } from 'common';
import { IncomingMessage } from 'http';
import ChatRoom from './Room/ChatRoom';
import BreakRoom from './Room/BreakRoom';

const breakRoom = new BreakRoom();
const roomMap = new Map<string, ChatRoom>();

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
  console.log("onClose");
  const result = breakRoom.exit(ws);
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
  breakRoom.join(ws, userId);

  ws.on('message',(data, isBinary) => {
    const dataString = data.toString();
    try {
      const signal: Signal= JSON.parse(dataString);
      if (!isSignal(signal)) throw new Error("the data received isn't signal type");
      console.log(signal.type);
      
      switch (signal.type) {
        case "CreateRoom":
          roomMap.set(signal.roomId, new ChatRoom(signal.roomId, roomCleaner));
          breakRoom.migrate(ws, roomMap.get(signal.roomId));
          break;
        case "JoinRoom":
          breakRoom.migrate(ws, roomMap.get(signal.roomId));
          break;
        case "Offer":
          const offerSignal = signal as AnswerSignal;
          if (!offerSignal.data) break;
          roomMap.get(offerSignal.roomId)?.sendOffer(offerSignal.sender, offerSignal.receiver, offerSignal.data);
          break;
        case "Answer":
          const AnswerSignal = signal as AnswerSignal;
          if (!AnswerSignal.data) break;
          roomMap.get(signal.roomId)?.sendAnswer(AnswerSignal.sender, AnswerSignal.receiver, AnswerSignal.data);
          break;
        case "Ping":

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