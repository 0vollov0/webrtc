import styled from "styled-components";
import { RoomButton } from "../../styles/button";
import { RoomProps } from "./Room";

const ExistRoomFrame = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0px 10px;
`

interface ExitRoomProps extends RoomProps {
  roomId: string;
}

export const ExitRoom: React.FC<ExitRoomProps> = ({
  roomId,
  handleRoomId
}) => {

  return (
    <ExistRoomFrame>
      <div>Current Room: {roomId}</div>
      <RoomButton onClick={() => handleRoomId("")}>Exit Room</RoomButton>
    </ExistRoomFrame>
  )
}