import styled from "styled-components";
import { TDisconnect } from "../../hooks/usePeerConnection";
import { RoomButton } from "../../styles/button";

const ExistRoomFrame = styled.div`
  display: flex;
  flex-direction: row;
  place-items: center;
  gap: 0px 10px;
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
      <div>Current Room: {roomId}</div>
      <RoomButton onClick={disconnect}>Exit Room</RoomButton>
    </ExistRoomFrame>
  )
}