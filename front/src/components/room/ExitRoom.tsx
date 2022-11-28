import styled from "styled-components";
import { TDisconnect } from "../../hook/usePeerConnection";
import { RoomButton } from "../../styles/button";
import { RoomProps } from "./Room";

const ExistRoomFrame = styled.div`
  display: flex;
  flex-direction: row;
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