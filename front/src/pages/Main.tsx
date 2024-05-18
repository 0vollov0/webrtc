import React from 'react';
import { Entrance } from '../components/Entrance';
import { useAppSelector } from '../hooks';
import Loading from '../components/Loading';


export const Main: React.FC = () => {
  const connected = useAppSelector(state => state.signal.connected)
  return (
    <React.Fragment>
      {
        connected ? <Entrance/> : <Loading/>
      }
    </React.Fragment>
  )
}