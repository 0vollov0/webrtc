import { useCallback, useState } from "react";
import styled from "styled-components"
import { CreateRoom } from "./CreateRoom"
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
  createOffer: (roomId: string, callback: (err: any) => void) => void
}

export const RoomController:React.FC<RoomControllerProps> = ({
  connectedSignalChannel,
  createOffer
}) => {
  const [roomId, setRoomId] = useState<string>("");
  const handleRoomId = useCallback((roomId: string) => {
    setRoomId(roomId)
  },[])

  return (
    <RoomControllerFrame>
      <CreateRoom
        connectedSignalChannel={connectedSignalChannel}
        createOffer={createOffer}
        handleRoomId={handleRoomId}
      />
      <JoinRoom/>
    </RoomControllerFrame>
  )
}