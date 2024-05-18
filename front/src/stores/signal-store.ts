import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from './store';
import { socket } from '../socket';

const signal = socket;

export interface SocketState {
  connected: boolean;
  clientId: string;
}

const initialState: SocketState = {
  connected: false,
  clientId: '',
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
    }
  }
})

export const { offerSignal, setConnectStatus, updateClientId } = signalSlice.actions;
export default signalSlice.reducer;