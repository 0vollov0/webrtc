import { useCallback, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { UserContext } from "../contexts/UserConetxt";
import { usePeerConnection } from "../hooks/usePeerConnection";
import { LocalController } from "./LocalController";
import { RoomController } from "./room/RoomController";
import { Streams } from "./Streams";

const VideoChatFrame = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  grid-template-rows: auto 100px 80px;
  background-color: #363535;
  border-radius: 5px;
`

export type Device = 'audio' | 'video'

export interface SelectedDevice {
  audio?: MediaDeviceInfo;
  video?: MediaDeviceInfo;
}

export interface DeviceState {
  audio: boolean;
  video: boolean;
}

export const VideoChat: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<SelectedDevice>();
  const [deviceState, setDeviceState] = useState<DeviceState>({
    audio: true,
    video: true,
  });
  const [localStream, setLocalStream] = useState<MediaStream>();
  const { userId } = useContext(UserContext);
  const [ remoteStreamMap, signalChannel, roomId, createRoom, joinRoom, disconnect ] = usePeerConnection(userId, localStream);

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

  const onChangeDeviceState = (type: Device, state: boolean) => {
    setDeviceState({
      ...deviceState,
      [type]: state
    })
  }

  useEffect(() => {
    if(!selectedDevice) return;
    const constraints: MediaStreamConstraints = {
      audio: selectedDevice.audio ? {
        deviceId: selectedDevice.audio.deviceId,
        echoCancellation: true,
      } : false,
      video: !selectedDevice.video ? false : {
        deviceId: selectedDevice.video.deviceId
      },
    }
    navigator.mediaDevices.getUserMedia(constraints).then(setLocalStream);
  },[selectedDevice])

  return (
    <VideoChatFrame>
      <Streams
        remoteStreamMap={remoteStreamMap}
        localStream={localStream}
        deviceState={deviceState}
      />
      <RoomController
        roomId={roomId}
        signalChannel={signalChannel}
        createRoom={createRoom}
        joinRoom={joinRoom}
        disconnect={disconnect}
      />
      <LocalController
        selectedDevice={selectedDevice}
        onChangeDevice={onChangeDevice}
        onChangeDeviceState={onChangeDeviceState}
        deviceState={deviceState}
      />
    </VideoChatFrame>
  )
}