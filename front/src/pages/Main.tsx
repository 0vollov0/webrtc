import React, { useEffect } from 'react';
import { Entrance } from '../components/Entrance';
import { useAppDispatch, useAppSelector } from '../hooks';
import Loading from '../components/Loading';


export const Main: React.FC = () => {
  // const socket = useAppSelector(state => state.signal.socket);
  const connected = useAppSelector(state => state.signal.connected)
  const dispatch = useAppDispatch()
  return (
    <React.Fragment>
      {
        connected ? <Entrance/> : <Loading/>
      }
    </React.Fragment>
  )
}