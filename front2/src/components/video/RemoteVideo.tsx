import { useEffect, useRef, useState } from "react";
import { VideoFrame, VideoScreen, VideoScreenProps } from "./styles/vidoe-style";

interface RemoteVideoProps {
  stream?: MediaStream;
}

export const RemoteVideo: React.FC<RemoteVideoProps> = ({
  stream
}) => {
  const videoFrameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoScreenProps, setVideoScreenProps] = useState<VideoScreenProps>({
    width: 0,
    aspectRatio: 0
  })

  const onResize = () => {
    if (!videoFrameRef.current) return;
    const width = videoFrameRef.current.clientWidth * 0.95;
    const height = videoFrameRef.current.clientHeight * 0.95
    setVideoScreenProps({
      width,
      aspectRatio: width / height
    })
  }

  useEffect(() => {
    if (!videoRef.current || !stream) return;
    videoRef.current.srcObject = stream;
  }, [stream]);

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
        width={videoScreenProps.width}
        aspectRatio={videoScreenProps.aspectRatio}
        ref={videoRef}
        autoPlay={true}
        controls={false}
      />
    </VideoFrame>
  )
}