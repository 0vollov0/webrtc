import React, { useEffect, useState } from 'react';
import { Entrance } from '../components/Entrance';
import { useAppSelector } from '../hooks';
import Loading from '../components/Loading';
import { Controller } from '../components/Controller';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { useDispatch } from 'react-redux';
import {  updateScreenMode } from '../stores/screen-store';
import { LocalStream } from '../components/LocalStream';
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
  const room = useAppSelector(state => state.signal.room);
  const videoinputs = useAppSelector(state => state.device.videoinputs);
  const [stream, setStream] = useState<MediaStream>();
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateScreenMode(isMobile ? 'mobile' : 'desktop'))
  }, [isMobile, dispatch])

  useEffect(() => {
    if (!videoinputs.length) return;
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        deviceId: videoinputs[videoinputs.length-1].deviceId,
      }
    }).then(setStream);
  }, [videoinputs])

  return (
    <React.Fragment>
      {
        connected ? <Entrance/> : <Loading/>
      }
      {
        room.length && stream ? (
          (
            <>
              <MainFrame>
                <VideoChat
                  localStream={stream}
                />
                {/* <LocalStream/> */}
              </MainFrame>
              <Controller/>
            </>
          )
        ) : <></>
      }
    </React.Fragment>
  )
}