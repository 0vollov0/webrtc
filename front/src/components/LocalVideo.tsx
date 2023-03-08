import { useEffect, useRef, useState } from "react";
import styled from "styled-components"
import { ScreenMode } from "../types";
import { DeviceState } from "./VideoChat";

interface VideoScreenProps {
  width: number;
  aspectRatio: number;
}

export const VideoScreen = styled.video<VideoScreenProps>`
  width: calc(${({width}) => width}px * 0.95);
  aspect-ratio: ${({aspectRatio}) => aspectRatio};
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
  deviceState: DeviceState;
  stream?: MediaStream;
}

export const LocalVideo: React.FC<VideoProps> = ({
  deviceState,
  stream,
}) => {
  const videoFrameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFrameSize, setVideoFrameSize] = useState<{
    width: number,
    height: number
  }>({
    width: 0,
    height: 0
  })

  const onResize = () => {
    if (!videoFrameRef.current) return;
    setVideoFrameSize({
      width: videoFrameRef.current?.clientWidth * 0.95,
      height: videoFrameRef.current?.clientHeight * 0.95
    })
  }

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

  useEffect(() => {
    onResize();
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  },[onResize])

  return (
    <VideoFrame ref={videoFrameRef}>
      <VideoScreen
        // screenMode={screenMode}
        width={videoFrameSize.width}
        aspectRatio={videoFrameSize.width/videoFrameSize.height}
        ref={videoRef}
        autoPlay={true}
        controls={false}
        muted
      />
    </VideoFrame>
  )
}