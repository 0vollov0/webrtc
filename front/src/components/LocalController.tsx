import styled from "styled-components"
import { DeviceSelector } from "./DeviceSelector"

const LocalControllerFrame = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0px 10px;
`

interface LocalControllerProps {
  onChangeDevice: (device: MediaDeviceInfo) => void;
}

export const LocalController:React.FC<LocalControllerProps> = ({
  onChangeDevice
}) => {

  return (
    <LocalControllerFrame>
      <DeviceSelector
        kind="videoinput"
        onChangeDevice={onChangeDevice}
      />
      <DeviceSelector
        kind="audioinput"
        onChangeDevice={onChangeDevice}
      />
    </LocalControllerFrame>
  )
}