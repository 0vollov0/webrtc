import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface ScreenState {
  mode: 'mobile' | 'desktop';
}

const initialState: ScreenState = {
  mode: 'desktop',
}

export const screenSlice = createSlice({
  name: 'screen',
  initialState,
  reducers: {
    updateScreenMode: (state, action: PayloadAction<'mobile' | 'desktop'>) => {
      state.mode = action.payload;
    }
  }
})

export const { updateScreenMode } = screenSlice.actions;
export default screenSlice.reducer;