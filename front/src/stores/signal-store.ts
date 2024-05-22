import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { SOCKET_ERROR_CODE, socket } from '../socket';

export const signalConnection = socket;

export interface SocketState {
  connected: boolean;
  clientId: string;
  room: string;
  errorCode: SOCKET_ERROR_CODE;
}

const initialState: SocketState = {
  connected: false,
  clientId: '',
  room: '',
  errorCode: SOCKET_ERROR_CODE.NONE,
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
      signalConnection.emit('create-room', {
        name: action.payload,
      })
    },
    joinRoom: (state, action: PayloadAction<string>) => {
      if (!state.connected) return;
      signalConnection.emit('join-room', {
        name: action.payload,
      })
    },
    updateRoom: (state, action: PayloadAction<string>) => {
      state.room = action.payload;
    },
    updateError: (state, action: PayloadAction<SOCKET_ERROR_CODE>) => {
      state.errorCode = action.payload;
    }
  }
})

export const { offerSignal, setConnectStatus, updateClientId, createRoom, joinRoom, updateRoom, updateError } = signalSlice.actions;
export default signalSlice.reducer;