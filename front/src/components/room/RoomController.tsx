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

interface RoomControllerProps {

}

export const RoomController:React.FC<RoomControllerProps> = ({

}) => {

  return (
    <RoomControllerFrame>
      <CreateRoom/>
      <JoinRoom/>
    </RoomControllerFrame>
  )
}