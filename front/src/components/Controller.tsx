import React from "react";
import styled from "styled-components";
import { MicController } from "./controller-menus/MicController";
import { AudioController } from "./controller-menus/AudioController";
import { CamController } from "./controller-menus/CamController";

const ControllerFrame = styled.div`
  position: fixed;
  width: 100vw;
  height: 65px;
  background-color: #212121;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0px 30px;
`

export const Controller: React.FC = () => {
  return (
    <ControllerFrame>
      <AudioController/>
      <MicController/>
      <CamController/>
    </ControllerFrame>
  )
}