import styled from "styled-components"
import { RoomButton } from "../../styles/button"
import { RoomInput } from "../../styles/input"

const CreateRoomFrame = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0px 20px;
  align-items: center;
  justify-content: center;
`

export const JoinRoom: React.FC = () => {
  return (
    <CreateRoomFrame>
      <form action="">
        <RoomInput type="text" placeholder="type a room name which you want to join"/>
      </form>
      <RoomButton>Join Room</RoomButton>
    </CreateRoomFrame>
  )
}