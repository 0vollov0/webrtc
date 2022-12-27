import styled from "styled-components"
import { CameraController } from "./controllers/CameraController";
import { MicController } from "./controllers/MicController";
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
      <CameraController
        kind="videoinput"
        onChangeDevice={onChangeDevice}
        selectedDevice={selectedDevice?.video}
      />
    </LocalControllerFrame>
  )
}