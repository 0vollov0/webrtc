import styled from "styled-components";

export interface VideoScreenProps {
  width: number;
  aspectRatio: number;
}

export const VideoScreen = styled.video<VideoScreenProps>`
  width: calc(${({width}) => width}px * 0.95);
  aspect-ratio: ${({aspectRatio}) => aspectRatio};
  object-fit: fill;
  border-radius: 2.5px;
`

export const VideoFrame = styled.div`
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  background-color: inherit;
  padding: 5px;
`