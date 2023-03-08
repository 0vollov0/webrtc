import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { LocalVideo } from "./video/LocalVideo";
import { RemoteVideo } from "./video/RemoteVideo";
import { DeviceState } from "./VideoChat";

const VideoChatRoomFrame = styled.div<{participantCount: number}>`
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  ${(props) => {
    if (props.participantCount === 1) return ``;
    else if (props.participantCount === 2) return `grid-template-columns: 1fr 1fr`;
    else return `
      grid-template-rows: 1fr 1fr;
      grid-template-columns: repeat(${Math.ceil(props.participantCount/2)}, 1fr);
    `
  }}
`

interface VideoChatRoomProps {
  remoteStreamMap: Map<string, MediaStream>;
  deviceState: DeviceState;
  localStream?: MediaStream;
}


export const VideoChatRoom: React.FC<VideoChatRoomProps> = ({
  localStream,
  remoteStreamMap,
  deviceState
}) => {
  const [ participantCount, setParticipantCount] = useState(0);
  useEffect(() => {
    setParticipantCount(remoteStreamMap.size + (localStream ? 1 : 0));
  }, [localStream, remoteStreamMap]);

  return (
    <VideoChatRoomFrame
      participantCount={participantCount}
    >
      <LocalVideo
        stream={localStream}
        deviceState={deviceState}
      />
      {
        Array.from(remoteStreamMap).map(([_, stream], index) => (
          <RemoteVideo
            key={index}
            stream={stream} 
          />
        ))
      }
    </VideoChatRoomFrame>
  )
}