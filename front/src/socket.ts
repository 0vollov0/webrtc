import { io } from "socket.io-client";
import { setConnectStatus, updateClientId, updateError, updateRoom } from "./stores/signal-store";
import { store } from "./stores/store";

export const socket = io(import.meta.env.VITE_SIGNAL_HOST || 'http://localhost:8081');

export enum SOCKET_ERROR_CODE {
  NONE,
  CREATE_ROOM,
  JOIN_ROOM,
  EXIT_ROOM,
}

export interface SocketException {
  error: {
    code: SOCKET_ERROR_CODE;
    message: string;
  },
  message: string;
}

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

socket.on('error', (exception: SocketException) => {
  store.dispatch(updateError(exception.error.code))
})