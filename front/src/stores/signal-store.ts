import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from './store';
import { socket } from '../socket';

const signal = socket;

export interface SocketState {
  connected: boolean;
  clientId: string;
  room: string;
}

const initialState: SocketState = {
  connected: false,
  clientId: '',
  room: '',
}

export const signalSlice = createSlice({
  name: 'signal',
  initialState,
  reducers: {
    offerSignal: () => {
      
    },
    setConnectStatus: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
    updateClientId: (state, action: PayloadAction<string>) => {
      state.clientId = action.payload;
    },
    createRoom: (state, action: PayloadAction<string>) => {
      if (!state.connected) return;
      signal.emit('create-room', {
        name: action.payload,
      })
    },
    joinRoom: (state, action: PayloadAction<string>) => {
      if (!state.connected) return;
      signal.emit('join-room', {
        name: action.payload,
      })
    },
    updateRoom: (state, action: PayloadAction<string>) => {
      state.room = action.payload;
    },
  }
})

export const { offerSignal, setConnectStatus, updateClientId, createRoom, joinRoom, updateRoom } = signalSlice.actions;
export default signalSlice.reducer;