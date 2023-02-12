import { useEffect, useRef, useState } from "react";
import styled from "styled-components"
import { ScreenMode } from "../types";

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
  stream?: MediaStream;
}

export const LocalVideo: React.FC<VideoProps> = ({
  screenMode,
  stream
}) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ height, setHeight ] = useState<number>(0);

  useEffect(() => {
    if (!videoRef.current || !stream) return;
    videoRef.current.srcObject = stream;
  }, [stream]);

  useEffect(() => {
    if(frameRef.current){
      setHeight(frameRef.current?.clientHeight); 
    }
  }, []);

  useEffect(() => {
    console.log(stream?.getVideoTracks(),"local stream");
    
  }, [stream]);

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