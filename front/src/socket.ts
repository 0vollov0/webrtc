import { io } from "socket.io-client";
import { setConnectStatus, updateClientId, updateRoom } from "./stores/signal-store";
import { store } from "./stores/store";

export const socket = io(import.meta.env.VITE_SIGNAL_HOST || 'http://localhost:8081');

socket.on('connect', () => {
  store.dispatch(setConnectStatus(true));
});

socket.on('disconnect', () => {
  store.dispatch(setConnectStatus(false));
});

socket.on('connect_error', () => {
  store.dispatch(setConnectStatus(false));
});

socket.on('client_id', (id) => {
  store.dispatch(updateClientId(id));
})

socket.on('create-room', (room) => {
  store.dispatch(updateRoom(room));
})

socket.on('join-room', (room) => {
  store.dispatch(updateRoom(room));
})

socket.on('exit-room', () => {
  store.dispatch(updateRoom(''));
})

socket.on('error', (exception) => {
  console.log(exception);
})