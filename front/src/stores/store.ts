import { configureStore } from '@reduxjs/toolkit'
import signalReducer from './signal-store';
import deviceReducer from './device-store';
import screenReducer from './screen-store';


export const store =  configureStore({
  reducer: {
    signal: signalReducer,
    device: deviceReducer,
    screen: screenReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;