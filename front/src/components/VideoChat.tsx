import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { usePeerConnection } from "../hook/usePeerConnection";
import { LocalController } from "./LocalController";
import { LocalVideo } from "./LocalVideo";
import { config } from "../config";

const VideoChatFrame = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;

  grid-template-rows: auto 150px;
`

interface ISelectedDevice {
  audio?: MediaDeviceInfo;
  video?: MediaDeviceInfo;
}

export const VideoChat: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<ISelectedDevice>();
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [ createOffer ] = usePeerConnection();

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
    navigator.mediaDevices.getUserMedia(constraints).then(setLocalStream);
  },[selectedDevice])

  // useEffect(() => {
  //   console.log(connected,"connected");
  // }, [connected]);

  useEffect(() => {
    console.log("VideoChat");
    
  }, []);

  return (
    <VideoChatFrame>
      <LocalVideo
        stream={localStream}
      />
      <LocalController
        onChangeDevice={onChangeDevice}
      />
    </VideoChatFrame>
  )
}