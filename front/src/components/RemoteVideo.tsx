import { useEffect, useRef } from "react";
import styled from "styled-components"

const VideoScreen = styled.video`
  width: 320px;
  height: 320px;
  /* background-color: antiquewhite; */
`

interface VideoProps {
  stream?: MediaStream;
}

export const RemoteVideo: React.FC<VideoProps> = ({
  stream
}) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!ref.current || !stream) return;
    ref.current.srcObject = stream;
  }, [stream]);

  return (
    <VideoScreen
      ref={ref}
      autoPlay={true}
      controls={false}
    />
  )
}