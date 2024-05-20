import React, { useEffect } from 'react';
import { Entrance } from '../components/Entrance';
import { useAppSelector } from '../hooks';
import Loading from '../components/Loading';
import { Controller } from '../components/Controller';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateScreenMode } from '../stores/screen-store';

export const Main: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const connected = useAppSelector(state => state.signal.connected);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateScreenMode(isMobile ? 'mobile' : 'desktop'))
  }, [isMobile, dispatch])

  return (
    <React.Fragment>
      {
        connected ? <Entrance/> : <Loading/>
      }
      <Controller/>
    </React.Fragment>
  )
}