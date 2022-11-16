import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { DeviceSelector } from "../components/DeviceSelector";
import { Video } from "../components/Video";

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

interface ISelectedDevice {
  audio?: MediaDeviceInfo;
  video?: MediaDeviceInfo;
}

export const Main: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<ISelectedDevice>();
  const [localStream, setLocalStream] = useState<MediaStream>();

  const onChangeDevice = useCallback((device: MediaDeviceInfo) => {
    switch (device.kind) {
      case "audioinput":
        setSelectedDevice(selectedDevice => {
          return {
            video: selectedDevice?.video,
            audio: device
          }
        })
        break;
      case "videoinput":
        setSelectedDevice(selectedDevice => {
          return {
            audio: selectedDevice?.audio,
            video: device
          }
        })
        break;
      default:
        break;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(() => {
    if(!selectedDevice) return;
    const constraints: MediaStreamConstraints = {
      audio: !selectedDevice.audio ? false : {
        deviceId: selectedDevice.audio.deviceId,
        echoCancellation: true,
      },
      video: !selectedDevice.video ? false : {
        deviceId: selectedDevice.video.deviceId
      },
    }
    console.log(constraints);
    
    navigator.mediaDevices.getUserMedia(constraints).then(setLocalStream);

  },[selectedDevice])

  return (
    <MainFrame>
      <Video
        stream={localStream}
      />
      <DeviceSelectorFrame>
        <DeviceSelector
          kind="videoinput"
          onChangeDevice={onChangeDevice}
        />
        <DeviceSelector
          kind="audioinput"
          onChangeDevice={onChangeDevice}
        />
      </DeviceSelectorFrame>
    </MainFrame>
  )
}