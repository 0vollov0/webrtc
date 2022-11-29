import { useCallback } from "react"
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

interface CreateRoomProps extends Pick<RoomControllerProps, 'connectedSignalChannel' | 'createRoom'> {}

export const CreateRoom: React.FC<CreateRoomProps> = ({
  connectedSignalChannel,
  createRoom,
}) => {
  const [ input, onInput, initInput ] = useInput();

  const callbackCreateOffer = useCallback((err: undefined | any) => {
    if (err) return;
    initInput();
    window.alert("The room was created successfully");
  },[initInput])

  const onCreateRoom = useCallback(() => {
    if (!connectedSignalChannel) return;
    createRoom(input);
  },[connectedSignalChannel, createRoom, input])

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