import styled from "styled-components"
import { useInput } from "../../hooks/useInput";
import { TCreateRoom, TDisconnect, TJoinRoom } from "../../hooks/usePeerConnection";
import { RoomButton } from "../../styles/button";
import { RoomInput } from "../../styles/input";
import { CreateRoom } from "./CreateRoom"
import { ExitRoom } from "./ExitRoom";
import { JoinRoom } from "./JoinRoom"

const RoomControllerFrame = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  gap: 10px 0px;
  background: #363535;
`

const Form = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0px 20px;
`
const ButtonFrames = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px 0px;
`


export interface RoomControllerProps {
  signalChannel?: WebSocket;
  roomId: string;
  createRoom: TCreateRoom;
  joinRoom: TJoinRoom;
  disconnect: TDisconnect
}

export const RoomController:React.FC<RoomControllerProps> = ({
  roomId,
  signalChannel,
  createRoom,
  joinRoom,
  disconnect
}) => {
  const [ input, onInput ] = useInput();
  const onCreateRoom = () => {
    if (!input.length) return;
    createRoom(input);
  }

  const onJoinRoom = () => {
    if (!input.length) return;
    joinRoom(input);
  }

  /* const [roomId, setRoomId] = useState<string>("");
  const handleRoomId: THandleRoomId = useCallback((roomId: string) => {
    setRoomId(roomId)
  },[]) */

  return (
    <RoomControllerFrame>
      {
        roomId === ""
        ? (
          <>
            <Form action="" >
              <RoomInput
                type="text"
                placeholder="Room Id"
                value={input}
                onChange={onInput}
              />
              <ButtonFrames>
                <RoomButton 
                  onClick={onCreateRoom}
                >
                  Create
                </RoomButton>
                <RoomButton 
                  onClick={onJoinRoom}
                >
                  Join
                </RoomButton>
              </ButtonFrames>
            </Form>
            {/* <CreateRoom
              signalChannel={signalChannel}
              createRoom={createRoom}
            />
            <JoinRoom
              joinRoom={joinRoom}
            /> */}
          </>
        )
        : (
          <ExitRoom
            roomId={roomId}
            disconnect={disconnect}
          />
        )
      }
    </RoomControllerFrame>
  )
}