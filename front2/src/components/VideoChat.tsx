import { useCallback, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { UserContext } from "../contexts/UserConetxt";
import { usePeerConnection } from "../hooks/usePeerConnection";
import { LocalController } from "./LocalController";
import { RoomController } from "./room/RoomController";
import { VideoChatRoom } from "./VideoChatRoom";
import { addResponseMessage, Widget } from 'react-chat-widget';

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
  const [
    remoteStreamMap,
    roomId,
    createRoom,
    joinRoom,
    disconnect,
    remoteDataChannel
  ] = usePeerConnection(userId, (event: MessageEvent<any>) => addResponseMessage(event.data), localStream);

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

  const handleNewUserMessage = (newMessage: string) => {
    remoteDataChannel.current.forEach((remoteDataChannel) => {
      remoteDataChannel.send(`${userId}:\n${newMessage}`);
    })
  };

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
      <VideoChatRoom
        remoteStreamMap={remoteStreamMap}
        localStream={localStream}
        deviceState={deviceState}
      />
      <RoomController
        roomId={roomId}
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
      {
        roomId.length
        ? (
          <Widget
            title="webrtc"
            subtitle="this chat is using datachnnel"
            handleNewUserMessage={handleNewUserMessage}
            emojis={true}
          />
        ) : <></>
      }
    </VideoChatFrame>
  )
}