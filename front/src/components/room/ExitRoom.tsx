import styled from "styled-components";
import { TDisconnect } from "../../hooks/usePeerConnection";
import { RoomButton } from "../../styles/button";

const ExistRoomFrame = styled.div`
  display: flex;
  flex-direction: row;
  place-items: center;
  gap: 0px 20px;
`

const RoomIdFrame = styled.div`
  color: #c7c7c9;
`

interface ExitRoomProps {
  roomId: string;
  disconnect: TDisconnect
}

export const ExitRoom: React.FC<ExitRoomProps> = ({
  roomId,
  disconnect
}) => {

  return (
    <ExistRoomFrame>
      <RoomIdFrame>Room: {roomId}</RoomIdFrame>
      <RoomButton onClick={disconnect}>Exit Room</RoomButton>
    </ExistRoomFrame>
  )
}