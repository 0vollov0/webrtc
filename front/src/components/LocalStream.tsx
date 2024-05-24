import React, { useEffect, useRef } from "react";
import Card from '@mui/material/Card';
import { Box, CardActionArea, Typography } from '@mui/material';
import { useAppSelector } from "../hooks";
import styled from "styled-components";
import PersonIcon from '@mui/icons-material/Person';

const Video = styled.video<{ hidden: boolean }>`
  width: 100%;
  height: 100%;
  position: relative;
  visibility: ${props => props.hidden ? 'hidden' : 'visible'};
`

interface LocalStreamProps {
  stream?: MediaStream;
}

export const LocalStream: React.FC<LocalStreamProps> = ({ stream }) => {
  const videoinputs = useAppSelector(state => state.device.videoinputs);
  const deviceState = useAppSelector(state => state.device.deviceState);
  const screenSize = useAppSelector(state => state.screen.size);

  // const [stream, setStream] = useState<MediaStream>();
  const ref = useRef<HTMLVideoElement>(null);
  
  // useEffect(() => {
  //   if (!videoinputs.length) return;
  //   navigator.mediaDevices.getUserMedia({
  //     audio: false,
  //     video: {
  //       deviceId: videoinputs[videoinputs.length-1].deviceId,
  //     }
  //   }).then(setStream);
  // }, [videoinputs])

  useEffect(() => {
    if (!ref.current || !stream) return;
    stream.getVideoTracks().forEach((track) => {
      track.enabled = deviceState.videoinput;
    })
    stream.getAudioTracks().forEach((track) => {
      track.enabled = deviceState.audioinput;
    })
    ref.current.srcObject = stream;
  }, [deviceState, stream]);

  return (
    <Card sx={{
      maxWidth: screenSize.width,
      maxHeight: screenSize.height,
      width: screenSize.width,
      height: screenSize.width * 0.5625,
      background: 'rgba(0, 0, 0, 0.35)',
      position: 'relative',
    }}>
      <Box sx={{ position: 'absolute', zIndex: 2, bottom: 15, right: 15 }}>
        <Typography component="div" variant="h4" color="white">
          나
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
        }}
      >
        <Video 
          ref={ref}
          autoPlay={deviceState.videoinput}
          controls={false}
          hidden={!deviceState.videoinput}
          muted
        />
        {
          !deviceState.videoinput ? <PersonIcon sx={{ color: 'white', fontSize: screenSize.width * 0.2 }}/> : <></>
        }
      </CardActionArea>
    </Card>
  )
}