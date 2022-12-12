import styled from "styled-components"
import { TCreateRoom, TDisconnect, TJoinRoom } from "../../hooks/usePeerConnection";
import { CreateRoom } from "./CreateRoom"
import { ExitRoom } from "./ExitRoom";
import { JoinRoom } from "./JoinRoom"

const RoomControllerFrame = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  gap: 10px 0px;
`

export interface RoomControllerProps {
  connectedSignalChannel: boolean;
  roomId: string;
  createRoom: TCreateRoom;
  joinRoom: TJoinRoom;
  disconnect: TDisconnect
}

export const RoomController:React.FC<RoomControllerProps> = ({
  roomId,
  connectedSignalChannel,
  createRoom,
  joinRoom,
  disconnect
}) => {
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
            <CreateRoom
              connectedSignalChannel={connectedSignalChannel}
              createRoom={createRoom}
            />
            <JoinRoom
              joinRoom={joinRoom}
            />
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