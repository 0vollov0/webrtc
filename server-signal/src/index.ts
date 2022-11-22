import WebSocket, { WebSocketServer } from 'ws';
import { Signal, isSignal } from 'common';

const wss = new WebSocketServer({
  port: 8080
})

wss.on('connection', (ws, req) => {
  ws.on('message',(data, isBinary) => {
    const dataString = data.toString();
    try {
      const signal: Signal = JSON.parse(dataString);
      if (!isSignal(signal)) throw new Error("the data received isn't signal type");
      switch (signal.type) {
        case "offer":
          
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