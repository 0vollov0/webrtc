import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ScreenMode } from "../types";
import { LocalVideo } from "./LocalVideo";
import { RemoteVideo } from "./RemoteVideo";
import { DeviceState } from "./VideoChat";

const StreamsFrame = styled.div`
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
`

interface StreamsProps {
  remoteStreamMap: Map<string, MediaStream>;
  deviceState: DeviceState;
  localStream?: MediaStream;
}


export const Streams: React.FC<StreamsProps> = ({
  localStream,
  remoteStreamMap,
  deviceState
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

  const onResize = () => {
    // setScreenMode(frameRef.current.clientWidth - frameRef.current.clientHeight > 0 ? 'vertical' : 'horizontal');
    setScreenMode(window.innerWidth - window.innerHeight > 0 ? 'vertical' : 'horizontal');
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

  return (
    <StreamsFrame>
      <LocalVideo
        stream={localStream}
        screenMode={screenMode}
        deviceState={deviceState}
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