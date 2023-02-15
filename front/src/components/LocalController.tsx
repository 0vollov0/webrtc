import { useState } from "react";
import styled from "styled-components"
import { CameraController } from "./controllers/CameraController";
import { MicController } from "./controllers/MicController";
import { Device, DeviceState, SelectedDevice } from "./VideoChat";

const LocalControllerFrame = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0px 30px;
  background-color: #363535;
  width: 100%;
  height: 100%;
`

interface LocalControllerProps {
  onChangeDevice: (device: MediaDeviceInfo) => void;
  onChangeDeviceState: (type: Device, state: boolean) => void;
  deviceState: DeviceState;
  selectedDevice?: SelectedDevice;
}

export const LocalController:React.FC<LocalControllerProps> = ({
  onChangeDevice,
  selectedDevice,
  deviceState,
  onChangeDeviceState
}) => {

  return (
    <LocalControllerFrame>
      <MicController
        kind="audioinput"
        onChangeDevice={onChangeDevice}
        selectedDevice={selectedDevice?.audio}
        enabled={deviceState.audio}
        setEnable={(enable) => onChangeDeviceState('audio', enable)}
      />
      <CameraController
        kind="videoinput"
        onChangeDevice={onChangeDevice}
        selectedDevice={selectedDevice?.video}
        enabled={deviceState.video}
        setEnable={(enable) => onChangeDeviceState('video', enable)}
      />
    </LocalControllerFrame>
  )
}