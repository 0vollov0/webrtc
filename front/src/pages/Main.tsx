import { useEffect } from "react";
import styled from "styled-components";
import { VideoChat } from "../components/VideoChat";

const MainFrame = styled.div`
  width: 100vw;
  height: 100vh;
  background: #E6E6E6;
`

export const Main: React.FC = () => {
  useEffect(() => {
    console.log("Main Render")
  }, []);
  return (
    <MainFrame>
      <VideoChat/>
    </MainFrame>
  )
}