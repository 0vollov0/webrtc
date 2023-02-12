import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { LocalVideo } from "./LocalVideo";

type Mode = 'row' | 'column';

interface StreamsFrameProps {
  mode: Mode;
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
  const [streamCnt, setStreamCnt] = useState(0);
  const [ mode, setMode ] = useState<Mode>('row');
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
    setMode(frameRef.current.clientWidth - frameRef.current.clientHeight > 0 ? 'column' : 'row');
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
    console.log(mode);
    
  },[mode])

  return (
    <StreamsFrame
      ref={frameRef}
      mode={mode}
      count={2}
    >
      <LocalVideo
        stream={localStream}
      /> 
      <LocalVideo
        stream={localStream}
      />
    </StreamsFrame>
  )
}