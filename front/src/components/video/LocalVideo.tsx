import { useEffect, useRef, useState } from "react";
import { DeviceState } from "../VideoChat";
import { VideoFrame, VideoScreen, VideoScreenProps } from "./styles/vidoe-style";

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
        width={videoScreenProps.width}
        aspectRatio={videoScreenProps.aspectRatio}
        ref={videoRef}
        autoPlay={true}
        controls={false}
        muted
      />
    </VideoFrame>
  )
}