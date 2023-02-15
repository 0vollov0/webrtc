import { useEffect, useRef, useState } from "react";
import styled from "styled-components"
import { ScreenMode } from "../types";
import { VideoFrame, VideoScreen } from "./LocalVideo";

interface RemoteVideoProps {
  remoteId: string;
  screenMode: ScreenMode;
  stream?: MediaStream;
}

export const RemoteVideo: React.FC<RemoteVideoProps> = ({
  stream,
  remoteId,
  screenMode
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

  return (
    <VideoFrame
      ref={frameRef}
    >
      <VideoScreen
        screenMode={screenMode}
        ref={videoRef}
        autoPlay={true}
        controls={false}
      />
    </VideoFrame>
  )
}