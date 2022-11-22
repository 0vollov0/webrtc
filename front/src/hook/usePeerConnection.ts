import { useCallback, useEffect, useRef, useState } from "react";
import WebSocket from 'ws';
import { Signal } from 'common';

interface UsePeerConnectionProps {
  signalHost: string;
}

type UsePeerConnectionReturn = [boolean, (callback: (err: undefined | any) => void) => void]

const RTCConfiguration: RTCConfiguration = {
  iceServers: [{'urls': 'stun:stun.l.google.com:19302'}]
}

export const usePeerConnection = ({ 
  signalHost 
}: UsePeerConnectionProps): UsePeerConnectionReturn => {
  const wsRef = useRef<WebSocket>();
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection>();

  const onMessage = useCallback((event: WebSocket.MessageEvent) => {

  },[])

  useEffect(() => {
    wsRef.current = new WebSocket(signalHost).on('open',() => setWsConnected(true));
  }, [signalHost]);

  useEffect(() => {
    if (!wsConnected) return;
    wsRef.current?.addEventListener('message', onMessage);
    return () => {
      wsRef.current?.removeAllListeners().close();
    }
  }, [wsConnected, wsRef, onMessage]);

  useEffect(() => {
    setPeerConnection(new RTCPeerConnection(RTCConfiguration))
  }, []);

  const sendOffer = useCallback((offer: RTCSessionDescriptionInit) => {
    const signal: Signal = {
      type: 'offer',
      data: offer,
    }
    const data = JSON.stringify(signal);
    wsRef.current?.send(data);
  },[wsRef])

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

  return [
    wsConnected,
    createOffer,
  ];
}