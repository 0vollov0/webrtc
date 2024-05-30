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

/* navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(() => {
}) */
navigator.mediaDevices.enumerateDevices().then((devices) => {
  store.dispatch(setDeviceInfo(
    devices.reduce((prev, value) => {
      if (value.kind === 'audioinput') prev.audioinputs.push(value.toJSON());
      else if (value.kind === 'videoinput') prev.videoinputs.push(value.toJSON());
      return {
        ...prev,
      }
    }, {
      audioinputs: [],
      videoinputs: [],
    } as Pick<DeviceState, 'audioinputs' | 'videoinputs'>)
  ))
})
navigator.mediaDevices.addEventListener('devicechange', () => {
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    store.dispatch(setDeviceInfo(
      devices.reduce((prev, value) => {
        if (value.kind === 'audioinput') prev.audioinputs.push(value.toJSON());
        else if (value.kind === 'videoinput') prev.videoinputs.push(value.toJSON());
        return {
          ...prev,
        }
      }, {
        audioinputs: [],
        videoinputs: [],
      } as Pick<DeviceState, 'audioinputs' | 'videoinputs'>)
    ))
  })
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
    setDeviceInfo: (state, action: PayloadAction<Pick<DeviceState, 'audioinputs' | 'videoinputs'>>) => {
      const audioinput = state.audioinputs[state.audioinputs.length - 1];
      const videoinput = state.videoinputs[state.videoinputs.length - 1];

      Object.keys(action.payload).forEach((key) => {
        const kinds = key as 'audioinputs' | 'videoinputs';
        const devices = action.payload[kinds].sort((a, b) => {
          if (key === 'audioinputs' && audioinput) {
            if (audioinput.deviceId === a.deviceId || audioinput.deviceId === b.deviceId) return -1;
          }
          if (key === 'videoinputs' && videoinput) {
            if (videoinput.deviceId === a.deviceId || videoinput.deviceId === b.deviceId) return -1;
          }
          if (a.deviceId === 'default') {
            return -1;
          } else if (b.deviceId === 'default') {
            return 1;
          } return 0;
        })
        state[kinds] = devices;
      })

    },
    selectDevice: (state, action: PayloadAction<SelectDeviceAction>) => {
      const temp = state[`${action.payload.kind}s`][state[`${action.payload.kind}s`].length-1];
      state[`${action.payload.kind}s`][state[`${action.payload.kind}s`].length-1] = state[`${action.payload.kind}s`][action.payload.index];
      state[`${action.payload.kind}s`][action.payload.index] = temp;
    }
  }
})
export const { updateDeviceState, selectDevice, setDeviceInfo } = deviceSlice.actions;
export default deviceSlice.reducer;
