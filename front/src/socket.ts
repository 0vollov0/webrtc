import { io } from "socket.io-client";
import { setConnectStatus } from "./stores/signal-store";
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