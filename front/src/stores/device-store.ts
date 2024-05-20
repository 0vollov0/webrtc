import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { store } from "./store";

interface DeviceState {
  audioinputs: SerializedMediaDeviceInfo[];
  audiooutputs: SerializedMediaDeviceInfo[];
  videoinputs: SerializedMediaDeviceInfo[];
  deviceState: Record<MediaDeviceKind, boolean>;
}

const initialState: DeviceState = {
  deviceState: {
    audioinput: true,
    audiooutput: true,
    videoinput: true,
  },
  audioinputs: [],
  audiooutputs: [],
  videoinputs: []
}

export interface SerializedMediaDeviceInfo {
  readonly deviceId: string;
  readonly groupId: string;
  readonly kind: MediaDeviceKind;
  readonly label: string;
}

interface SelectDeviceAction {
  index: number;
  kind: MediaDeviceKind;
  deviceId: string;
}

navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(() => {
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    const m = devices.map((device) => device.toJSON()) as SerializedMediaDeviceInfo[];
    store.dispatch(setDeviceInfo(m))
  })
})
navigator.mediaDevices.addEventListener('devicechange', (ev) => {
  console.log(ev);
  
})


interface UpdateDevicePayload {
  kind: MediaDeviceKind;
  enable: boolean;
}

export const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    updateDeviceState: (state, action: PayloadAction<UpdateDevicePayload>) => {
      state.deviceState[action.payload.kind] = action.payload.enable;
    },
    setDeviceInfo: (state, action: PayloadAction<SerializedMediaDeviceInfo[]>) => {
      const mediaDevices = new Map<MediaDeviceKind, SerializedMediaDeviceInfo[]>();
      mediaDevices.set('audioinput', []);
      mediaDevices.set('audiooutput', []);
      mediaDevices.set('videoinput', []);
      
      action.payload.sort((a,b) => {
        if (a.deviceId === 'default') {
          return -1;
        } else if (b.deviceId === 'default') {
          return 1;
        } return 0;
      }).forEach((device) => {
        state[`${device.kind}s`].push(device);
      })
    },
    selectDevice: (state, action: PayloadAction<SelectDeviceAction>) => {
      const temp = state[`${action.payload.kind}s`][state[`${action.payload.kind}s`].length-1];
      state[`${action.payload.kind}s`][state[`${action.payload.kind}s`].length-1] = state[`${action.payload.kind}s`][action.payload.index];
      state[`${action.payload.kind}s`][action.payload.index] = temp;
    }
  }
})
export const { updateDeviceState, setDeviceInfo, selectDevice } = deviceSlice.actions;
export default deviceSlice.reducer;
