import { configureStore } from '@reduxjs/toolkit'
import signalReducer from './signal-store';

export const store =  configureStore({
  reducer: {
    signal: signalReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;