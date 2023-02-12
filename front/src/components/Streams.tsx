import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ScreenMode } from "../types";
import { LocalVideo } from "./LocalVideo";
import { RemoteVideo } from "./RemoteVideo";


interface StreamsFrameProps {
  mode: ScreenMode;
  count: number;
}

const StreamsFrame = styled.div<StreamsFrameProps>`
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
`

interface StreamsProps {
  remoteStreamMap: Map<string, MediaStream>;
  localStream?: MediaStream;
}


export const Streams: React.FC<StreamsProps> = ({
  localStream,
  remoteStreamMap
}) => {
  const [ streamCnt, setStreamCnt] = useState(0);
  const [ screenMode, setScreenMode ] = useState<ScreenMode>('horizontal');
  const [ size, setSize ] = useState<{
    width: number,
    height: number,
  }>({
    width: 0,
    height: 0,
  })
  const frameRef = useRef<HTMLDivElement>(null);

  const onResize = () => {
    if (!frameRef.current) return;
    setSize({
      width: frameRef.current.clientWidth,
      height: frameRef.current.clientHeight,
    })
    setScreenMode(frameRef.current.clientWidth - frameRef.current.clientHeight > 0 ? 'vertical' : 'horizontal');
  }

  useEffect(() => {
    onResize();
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  },[])

  useEffect(() => {
    setStreamCnt(remoteStreamMap.size + (localStream ? 1 : 0));
  }, [localStream, remoteStreamMap]);

  useEffect(() => {
    console.log(screenMode);
    
  },[screenMode])

  useEffect(() => {
    console.log(remoteStreamMap);
    
  },[remoteStreamMap])

  return (
    <StreamsFrame
      ref={frameRef}
      mode={screenMode}
      count={2}
    >
      <LocalVideo
        stream={localStream}
        screenMode={screenMode}
      />
      {
        Array.from(remoteStreamMap).map(([id, stream], index) => (
          <RemoteVideo
            key={index}
            screenMode={screenMode}
            stream={stream} 
            remoteId={id}      
          />
        ))
      }
    </StreamsFrame>
  )
}