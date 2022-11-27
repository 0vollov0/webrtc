import { useCallback, useState } from "react";
import styled from "styled-components"
import { TCreateOffer, TJoinRoom } from "../../hook/usePeerConnection";
import { CreateRoom } from "./CreateRoom"
import { ExitRoom } from "./ExitRoom";
import { JoinRoom } from "./JoinRoom"
import { THandleRoomId } from "./Room";

const RoomControllerFrame = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  gap: 10px 0px;
`

export interface RoomControllerProps {
  connectedSignalChannel: boolean;
  createOffer: TCreateOffer;
  joinRoom: TJoinRoom;
}

export const RoomController:React.FC<RoomControllerProps> = ({
  connectedSignalChannel,
  createOffer,
  joinRoom
}) => {
  const [roomId, setRoomId] = useState<string>("");
  const handleRoomId: THandleRoomId = useCallback((roomId: string) => {
    setRoomId(roomId)
  },[])

  return (
    <RoomControllerFrame>
      {
        roomId === ""
        ? (
          <>
            <CreateRoom
              connectedSignalChannel={connectedSignalChannel}
              createOffer={createOffer}
              handleRoomId={handleRoomId}
            />
            <JoinRoom
              handleRoomId={handleRoomId}
              joinRoom={joinRoom}
            />
          </>
        )
        : (
          <ExitRoom
            roomId={roomId}
            handleRoomId={handleRoomId}
          />
        )
      }
    </RoomControllerFrame>
  )
}