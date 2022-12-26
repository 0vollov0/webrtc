import styled from "styled-components"
import { MicController } from "./controllers/MicController";
import { DeviceSelector } from "./DeviceSelector"
import { SelectedDevice } from "./VideoChat";

const LocalControllerFrame = styled.div`
  display: flex;
  flex-direction: row;
  /* justify-content: center; */
  align-items: center;
  justify-content: center;
  gap: 0px 30px;
  background-color: #363535;
  width: 100%;
  height: 100%;
`

interface LocalControllerProps {
  onChangeDevice: (device: MediaDeviceInfo) => void;
  selectedDevice?: SelectedDevice;
}

export const LocalController:React.FC<LocalControllerProps> = ({
  onChangeDevice,
  selectedDevice
}) => {

  return (
    <LocalControllerFrame>
      <MicController
        kind="audioinput"
        onChangeDevice={onChangeDevice}
        selectedDevice={selectedDevice?.audio}
      />
      <DeviceSelector
        kind="videoinput"
        onChangeDevice={onChangeDevice}
      />
      {/* <DeviceSelector
        kind="audioinput"
        onChangeDevice={onChangeDevice}
      /> */}
    </LocalControllerFrame>
  )
}