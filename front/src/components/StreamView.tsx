import styled from "styled-components";
import React, { useEffect, useRef, useState } from "react";
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
  const [block, setBlock] = useState<boolean>(false);

  useEffect(() => {
    if (!ref.current || !stream) return;
    ref.current.srcObject = stream;
  }, [stream])

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
          hidden={block}
        />
        {
          block ? <PersonIcon sx={{ color: 'white', fontSize: screenSize.width * 0.2 }}/>: <></>
        }
      </CardActionArea>
    </Card>
  )
}