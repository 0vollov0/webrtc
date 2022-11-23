import { useCallback, useEffect, useRef, useState } from "react";
import { Signal } from 'common';
import { config } from "../config";

type UsePeerConnectionReturn = [boolean, (callback: (err: undefined | any) => void) => void]

const RTCConfiguration: RTCConfiguration = {
  iceServers: [{'urls': 'stun:stun.l.google.com:19302'}]
}

export const usePeerConnection = (): UsePeerConnectionReturn => {
  const signalChannel = useRef<WebSocket>();
  const [connected, setConnected] = useState<boolean>(false);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection>();

  const onMessage = useCallback((event: MessageEvent<any>) => {

  },[])

  useEffect(() => {
    signalChannel.current?.addEventListener('message', onMessage);
    return () => {
      signalChannel.current?.removeEventListener('message', onMessage)
    }
  }, [signalChannel, onMessage]);

  useEffect(() => {
    setPeerConnection(new RTCPeerConnection(RTCConfiguration))
  }, []);

  const sendOffer = useCallback((offer: RTCSessionDescriptionInit) => {
    const signal: Signal = {
      type: 'offer',
      data: offer,
    }
    const data = JSON.stringify(signal);
    signalChannel.current?.send(data);
  },[signalChannel])

  const createOffer = useCallback((callback: (err: undefined | any) => void) => {
    if (!peerConnection) return;
    peerConnection.createOffer()
      .then((description) => 
        peerConnection.setLocalDescription(description)
          .then(() => {
            sendOffer(description);
            callback(undefined);
          })
          .catch(callback)
      )
      .catch(callback)
  },[peerConnection, sendOffer])

  useEffect(() => {
    signalChannel.current = new WebSocket(`${config.signalHost}?userId=${new Date().getTime()}`);
  }, []);

  return [
    connected,
    createOffer,
  ];
}