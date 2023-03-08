import { useEffect, useRef, useState } from "react";
import { VideoFrame, VideoScreen } from "./LocalVideo";

interface RemoteVideoProps {
  remoteId: string;
  stream?: MediaStream;
}

export const RemoteVideo: React.FC<RemoteVideoProps> = ({
  remoteId,
  stream
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
    videoRef.current.srcObject = stream;
  }, [stream]);

  // useEffect(() => {
  //   onResize();
  // },[streamCnt])

  useEffect(() => {
    onResize();
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  },[onResize])

  return (
    <VideoFrame
      ref={videoFrameRef}
    >
      <VideoScreen
        width={videoFrameSize.width}
        aspectRatio={videoFrameSize.width/videoFrameSize.height}
        ref={videoRef}
        autoPlay={true}
        controls={false}
      />
    </VideoFrame>
  )
}