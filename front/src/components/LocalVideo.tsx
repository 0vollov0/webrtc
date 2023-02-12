import { useEffect, useRef, useState } from "react";
import styled from "styled-components"

const VideoScreen = styled.video`
  /* width: inherit; */
  height: inherit;
  object-fit: fill;
  border-radius: 2.5px;
`

const VideoFrame = styled.div`
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  background-color: inherit;
  padding: 5px;
`

interface VideoProps {
  stream?: MediaStream;
}

export const LocalVideo: React.FC<VideoProps> = ({
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
        ref={videoRef}
        autoPlay={true}
        controls={false}
        muted
      />
    </VideoFrame>
  )
}