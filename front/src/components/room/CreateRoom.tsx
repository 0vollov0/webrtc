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

export const CreateRoom: React.FC = () => {
  return (
    <CreateRoomFrame>
      <form action="">
        <div style={{
          textAlign: 'center'
        }}>
          <RoomInput type="text" placeholder="type a room name what you want to create" />
        </div>
      </form>
      <RoomButton>Create Room</RoomButton>
    </CreateRoomFrame>
  )
}