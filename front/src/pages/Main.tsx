import React, { useEffect, useState } from 'react';
import { Entrance } from '../components/Entrance';
import { useAppSelector } from '../hooks';
import Loading from '../components/Loading';
import { Controller } from '../components/Controller';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { useDispatch } from 'react-redux';
import {  updateScreenMode } from '../stores/screen-store';
import styled from 'styled-components';
import { VideoChat } from '../components/VideoChat';

const MainFrame = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: calc(100vh - 65px);
`
export const Main: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const connected = useAppSelector(state => state.signal.connected);
  const videoinputs = useAppSelector(state => state.device.videoinputs);
  const audioinputs = useAppSelector(state => state.device.audioinputs);
  const deviceState = useAppSelector(state => state.device.deviceState);

  const [stream, setStream] = useState<MediaStream | undefined>();
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateScreenMode(isMobile ? 'mobile' : 'desktop'))
  }, [isMobile, dispatch])

  useEffect(() => {
    if (videoinputs.length || audioinputs.length) {      
      navigator.mediaDevices.getUserMedia({
        audio: !deviceState.audioinput || !audioinputs.length ? false : {
          deviceId: audioinputs[audioinputs.length-1].deviceId,
          echoCancellation: true,
        },
        video: !deviceState.videoinput || !videoinputs.length ? false : {
          deviceId: videoinputs[videoinputs.length-1].deviceId,
        },
      }).then(setStream);
    }    
    return () => setStream(undefined);
  }, [videoinputs, audioinputs, deviceState.audioinput, deviceState.videoinput])

  return (
    <React.Fragment>
      {
        connected ? <Entrance/> : <Loading/>
      }
      {
        stream
        ? (
          <MainFrame>
            <VideoChat
              localStream={stream}
            />
          </MainFrame>
        ) : <Loading/>
      }
      <Controller/>
    </React.Fragment>
  )
}