import { useEffect, useState } from "react";
import styled from "styled-components";
import { LocalVideo } from "./LocalVideo";
import { RemoteVideo } from "./RemoteVideo";

const StreamsFrame = styled.div<{count: number}>`
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  grid-template-rows: repeat(${({count}) => count}, 1fr);
  grid-template-columns: repeat(${({count}) => count}, 1fr);
  gap: 5px 5px;
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

  useEffect(() => {
    setStreamCnt(remoteStreamMap.size + (localStream ? 1 : 0));
  }, [localStream, remoteStreamMap]);

  return (
    <StreamsFrame
      count={Math.ceil(Math.sqrt(streamCnt))}
    >
      {
        Array.from(remoteStreamMap.entries()).map(([id, stream]) => (
          <RemoteVideo
            key={id}
            remoteId={id}
            stream={stream}
          />
        ))
      }
      <LocalVideo
        stream={localStream}
      />
    </StreamsFrame>
  )
}