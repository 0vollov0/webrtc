import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { LocalVideo } from "./LocalVideo";
import { RemoteVideo } from "./RemoteVideo";
import { DeviceState } from "./VideoChat";

const StreamsFrame = styled.div<{streamCnt: number}>`
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  ${(props) => {
    if (props.streamCnt === 1) return ``;
    else if (props.streamCnt === 2) return `grid-template-columns: 1fr 1fr`;
    else return `
      grid-template-rows: 1fr 1fr;
      grid-template-columns: repeat(${Math.ceil(props.streamCnt/2)}, 1fr);
    `
  }}
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
  useEffect(() => {
    setStreamCnt(remoteStreamMap.size + (localStream ? 1 : 0));
  }, [localStream, remoteStreamMap]);

  return (
    <StreamsFrame
      streamCnt={streamCnt}
    >
      <LocalVideo
        stream={localStream}
        deviceState={deviceState}
      />
      {
        Array.from(remoteStreamMap).map(([id, stream], index) => (
          <RemoteVideo
            key={index}
            stream={stream} 
            remoteId={id}
          />
        ))
      }
    </StreamsFrame>
  )
}