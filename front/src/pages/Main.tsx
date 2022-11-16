import { useEffect } from "react";
import styled from "styled-components";
import { DeviceSelector } from "../components/DeviceSelector";
import { TDevice } from "../type/device";

const MainFrame = styled.div`
  width: 100vw;
  height: 100vh;
  background: #E6E6E6;
`

const DeviceSelectorFrame = styled.div`
  position: absolute;
  right: 30px;
  bottom: 30px;
`
const constraints = {
  'video': true,
  'audio': true
}

export const Main: React.FC = () => {
  useEffect(() => {
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
          console.log('Got MediaStream:', stream);
      })
      .catch(error => {
          console.error('Error accessing media devices.', error);
      });
  }, []);

  // const loadConnectedDevices = (type: TDevice, )

  return (
    <MainFrame>
      <DeviceSelectorFrame>
        <DeviceSelector
          kind="videoinput"
        />
        <DeviceSelector
          kind="audioinput"
        />
      </DeviceSelectorFrame>
    </MainFrame>
  )
}