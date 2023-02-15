import { useEffect, useRef, useState } from "react";
import styled from "styled-components"
import { ScreenMode } from "../types";
import { DeviceState } from "./VideoChat";

export const VideoScreen = styled.video<{screenMode: ScreenMode}>`
  ${({screenMode}) => {
    if (screenMode === 'horizontal') return `width: 100%;`
    else return `height: 100%;`
  }}
  object-fit: fill;
  border-radius: 2.5px;
`

export const VideoFrame = styled.div`
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  background-color: inherit;
  padding: 5px;
`

interface VideoProps {
  screenMode: ScreenMode;
  deviceState: DeviceState;
  stream?: MediaStream;
}

export const LocalVideo: React.FC<VideoProps> = ({
  screenMode,
  stream,
  deviceState
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current || !stream) return;
    stream.getVideoTracks().forEach((track) => {
      track.enabled = deviceState.video;
    })
    stream.getAudioTracks().forEach((track) => {
      track.enabled = deviceState.audio;
    })
    videoRef.current.srcObject = stream;
  }, [stream, deviceState]);

  return (
    <VideoFrame>
      <VideoScreen
        screenMode={screenMode}
        ref={videoRef}
        autoPlay={true}
        controls={false}
        muted
      />
    </VideoFrame>
  )
}