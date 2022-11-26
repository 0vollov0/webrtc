import { useCallback } from "react"
import styled from "styled-components"
import { useInput } from "../../hook/useInput"
import { RoomButton } from "../../styles/button"
import { RoomInput } from "../../styles/input"
import { RoomControllerProps } from "./RoomController"

const CreateRoomFrame = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0px 20px;
  align-items: center;
  justify-content: center;
`

interface CreateRoomProps extends Pick<RoomControllerProps, 'connectedSignalChannel' | 'createOffer'> {
  handleRoomId: (roomId: string) => void;
}

export const CreateRoom: React.FC<CreateRoomProps> = ({
  connectedSignalChannel,
  createOffer,
  handleRoomId
}) => {
  const [ input, onInput, initInput ] = useInput();

  const callbackCreateOffer = useCallback((err: undefined | any) => {
    if (err) return;
    handleRoomId(input);
    initInput();
    window.alert("The room was created successfully");
  },[handleRoomId, initInput, input])

  const onCreateRoom = useCallback(() => {
    if (!connectedSignalChannel) return;
    createOffer(input, callbackCreateOffer)
  },[connectedSignalChannel, input, createOffer, callbackCreateOffer])

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