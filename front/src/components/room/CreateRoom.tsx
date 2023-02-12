import { useCallback, useEffect } from "react"
import styled from "styled-components"
import { useInput } from "../../hooks/useInput"
import { RoomButton } from "../../styles/button"
import { RoomInput } from "../../styles/input"
import { RoomProps } from "./Room"
import { RoomControllerProps } from "./RoomController"

const CreateRoomFrame = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0px 20px;
  align-items: center;
  justify-content: center;
`

interface CreateRoomProps extends Pick<RoomControllerProps, 'signalChannel' | 'createRoom'> {}

export const CreateRoom: React.FC<CreateRoomProps> = ({
  signalChannel,
  createRoom,
}) => {
  const [ input, onInput ] = useInput();

  const onCreateRoom = () => {
    // if (signalChannel?.readyState !== 1) return;
    createRoom(input);
  }

  return (
    <CreateRoomFrame>
      <form action="">
        <div style={{
          textAlign: 'center'
        }}>
          <RoomInput
            type="text"
            placeholder="type a room name what you want to create" 
            value={input}
            onChange={onInput}
          />
        </div>
      </form>
      <RoomButton onClick={onCreateRoom}>Create Room</RoomButton>
    </CreateRoomFrame>
  )
}