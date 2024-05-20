import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { store } from "./store";

interface Size {
  width: number;
  height: number;
}

interface ScreenState {
  mode: 'mobile' | 'desktop';
  direction:  'vertical' | 'horizontal';
  size: Size;
}

const initialState: ScreenState = {
  mode: 'desktop',
  direction: 'vertical',
  size: {
    height: window.innerHeight - 65,
    width: window.innerWidth,
  }
}

window.addEventListener('resize', () => {
  store.dispatch(onResize({
    height: window.innerHeight - 65,
    width: window.innerWidth,
  }))
})

export const screenSlice = createSlice({
  name: 'screen',
  initialState,
  reducers: {
    updateScreenMode: (state, action: PayloadAction<'mobile' | 'desktop'>) => {
      state.mode = action.payload;
    },
    updateScreenDirection: (state, action: PayloadAction<'vertical' | 'horizontal'>) => {
      state.direction = action.payload;
    },
    onResize: (state, action: PayloadAction<Size>) => {
      state.size = action.payload;
      state.direction = action.payload.width > action.payload.height ? 'horizontal' : 'vertical';
    }
  }
})

export const { updateScreenMode, updateScreenDirection, onResize } = screenSlice.actions;
export default screenSlice.reducer;