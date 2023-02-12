import styled from "styled-components";
import { VideoChat } from "../components/VideoChat";

const MainFrame = styled.div`
  width: 100vw;
  height: 100vh;
  background: #0F1B26;
  display: grid;
  place-items: center;
`
export const Main: React.FC = () => {
  return (
    <MainFrame>
      <VideoChat/>
    </MainFrame>
  )
}