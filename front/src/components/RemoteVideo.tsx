import { useEffect, useRef, useState } from "react";
import styled from "styled-components"

const VideoScreen = styled.video`
  border-radius: 5px;
  width: auto;
`

const VideoFrame = styled.div`
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  background-color: #363535;
  border-radius: 5px;
`
interface RemoteVideoProps {
  remoteId: string;
  stream?: MediaStream;
}

export const RemoteVideo: React.FC<RemoteVideoProps> = ({
  stream,
  remoteId
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
    console.log(stream?.getVideoTracks(),"remote stream");
    
  }, [stream]);

  return (
    <VideoFrame
      ref={frameRef}
    >
      <VideoScreen
        ref={videoRef}
        autoPlay={true}
        controls={false}
        muted
        height={height*0.8}
      />
    </VideoFrame>
  )
}