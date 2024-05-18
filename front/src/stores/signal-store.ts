import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from './store';
import { socket } from '../socket';

const signal = socket;

export interface SocketState {
  connected: boolean;
}

const initialState: SocketState = {
  connected: false,
}

export const signalSlice = createSlice({
  name: 'signal',
  initialState,
  reducers: {
    offerSignal: () => {
      
    },
    setConnectStatus: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    }
  }
})

export const { offerSignal, setConnectStatus } = signalSlice.actions;
export default signalSlice.reducer;