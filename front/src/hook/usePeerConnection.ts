import { useCallback, useEffect, useRef, useState } from "react";
import { Signal } from 'common';
import { config } from "../config";
import { writeSync } from "fs";


export type TCreateOffer = (roomId: string, callback: (err: undefined | any) => void) => void;
export type TJoinRoom = (roomId: string) => void;

type UsePeerConnectionReturn = ReturnType<() => [
  boolean,
  TCreateOffer,
  TJoinRoom
]>;

const RTCConfiguration: RTCConfiguration = {
  iceServers: [{'urls': 'stun:stun.l.google.com:19302'}]
}

export const usePeerConnection = (): UsePeerConnectionReturn => {
  // const signalChannel = useRef<WebSocket>();
  const [signalChannel, setSignalChannel] = useState<WebSocket>();
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection>();

  const onMessage = useCallback((event: MessageEvent<any>) => {
    const { data } = event;
    const decode: Signal<any> = JSON.parse(data);

    switch (decode.type) {
      case "Offer":
        console.log("Offer")
        break;
    
      default:
        break;
    }
  },[])

  useEffect(() => {
    setPeerConnection(new RTCPeerConnection(RTCConfiguration))
  }, []);

  const sendCreateRoomSignal = useCallback((roomId: string, offer: RTCSessionDescriptionInit) => {
    const signal: Signal<RTCSessionDescriptionInit> = {
      roomId,
      type: 'CreateRoom',
      data: offer,
    }
    const encode = JSON.stringify(signal);
    signalChannel?.send(encode);
  },[signalChannel])

  const createOffer = useCallback((roomId: string, callback: (err: undefined | any) => void) => {
    if (!peerConnection) return;
    peerConnection.createOffer()
      .then((description) => 
        peerConnection.setLocalDescription(description)
          .then(() => {
            sendCreateRoomSignal(roomId, description);
            callback(undefined);
          })
          .catch(callback)
      )
      .catch(callback)
  },[peerConnection, sendCreateRoomSignal])

  const joinRoom = useCallback((roomId: string) => {
    const signal: Signal<any> = {
      roomId,
      type: 'JoinRoom'
    }
    const encode = JSON.stringify(signal);
    signalChannel?.send(encode);
  },[signalChannel])

  useEffect(() => {
    let ws: WebSocket;
    try {
      ws = new WebSocket(`${config.signalHost}?userId=${new Date().getTime()}`);
      ws.addEventListener('message',onMessage);
      setSignalChannel(ws);
    } catch (error) {
      console.error(error);
    }
    return () => {
      console.log("close");
      
      ws.close();
    }
  }, [onMessage]);

  return [
    signalChannel ? Boolean(signalChannel.readyState === 1) : false,
    createOffer,
    joinRoom
  ];
}