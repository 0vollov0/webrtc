import styled from "styled-components";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Card from '@mui/material/Card';
import { Box, CardActionArea, Typography } from '@mui/material';
import { useAppSelector } from "../hooks";
import PersonIcon from '@mui/icons-material/Person';

interface StreamViewProps {
  stream: MediaStream;
  participant: string;
}

const Video = styled.video<{ hidden: boolean }>`
  width: 100%;
  height: 100%;
  position: relative;
  visibility: ${props => props.hidden ? 'hidden' : 'visible'};
`

export const StreamView: React.FC<StreamViewProps> = ({
  stream,
  participant,
}) => {
  const screenSize = useAppSelector(state => state.screen.size);
  const ref = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isBlack, setIsBlack] = useState<boolean>(false)

  const [block, setBlock] = useState<boolean>(false);

  const isVideoBlack = useCallback((video: HTMLVideoElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const width = video.videoWidth;
    const height = video.videoHeight;

    if (width === 0 || height === 0) {
      return false;
    }
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    const frame = context.getImageData(0, 0, width, height);
    const data = frame.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (r !== 0 || g !== 0 || b !== 0) {
        return false;
      }
    }
    return true;
  },[])

  const checkVideoFrame = useCallback(() => {
    const video = ref.current;
    if (!video) return;
    const isBlack = isVideoBlack(video);
    if (isBlack) setIsBlack(true);
    else setIsBlack(false);
  }, [isVideoBlack])

  useEffect(() => {
    if (!ref.current || !stream) return;
    ref.current.srcObject = stream;
  }, [stream])

  useEffect(() => {
    const intervalId = setInterval(checkVideoFrame, 1000);
    return () => clearInterval(intervalId);
  }, [checkVideoFrame])

  return (
    <Card
      sx={{
        maxWidth: screenSize.width,
        maxHeight: screenSize.height,
        width: screenSize.width,
        height: screenSize.width * 0.5625,
        background: 'rgba(0, 0, 0, 0.35)',
        position: 'relative',
      }}
      onClick={() => setBlock((prev) => !prev)}
    >
      <Box sx={{ position: 'absolute', zIndex: 2, bottom: 5, right: 5 }}>
        <Typography component="div" color="white">
          {participant}
        </Typography>
      </Box>
      <CardActionArea
        sx={{
          width: '100%',
          height: '100%',
          zIndex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          overflow: 'hidden'
        }}
      >
        <Video 
          ref={ref}
          autoPlay={!block}
          controls={false}
          muted={block}
          hidden={block || isBlack}
        />
        {
          block || isBlack ? <PersonIcon sx={{ color: 'white', fontSize: screenSize.width * 0.2 }}/>: <></>
        }
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </CardActionArea>
    </Card>
  )
}