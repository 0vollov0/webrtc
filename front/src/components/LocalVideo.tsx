import { useEffect, useRef } from "react";
import styled from "styled-components"

const VideoScreen = styled.video`
  height: 100%;
  border-radius: 5px;
`

interface VideoProps {
  stream?: MediaStream;
}

export const LocalVideo: React.FC<VideoProps> = ({
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