import { useCallback, useEffect } from "react"
import styled from "styled-components"
import { useInput } from "../../hook/useInput"
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

interface JoinRoomProps extends RoomProps, Pick<RoomControllerProps, 'joinRoom'> {}

export const JoinRoom: React.FC<JoinRoomProps> = ({
  handleRoomId,
  joinRoom
}) => {
  const [ input, onInput, initInput ] = useInput();

  useEffect(() => {
    return () => {
      initInput();
    }
  }, [initInput]);

  const onClick = useCallback(() => {
    handleRoomId(input);
    joinRoom(input);
  },[handleRoomId, joinRoom, input])

  return (
    <CreateRoomFrame>
      <form action="">
        <RoomInput 
          type="text"
          placeholder="type a room name which you want to join"
          value={input}
          onChange={onInput}
        />
      </form>
      <RoomButton onClick={onClick}>Join Room</RoomButton>
    </CreateRoomFrame>
  )
}