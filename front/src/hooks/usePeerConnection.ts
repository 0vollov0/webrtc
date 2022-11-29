import { useCallback, useEffect, useRef, useState } from "react";
import { Signal, SignalOffer } from 'common';
import { config } from "../config";

export type TCreateOffer = (roomId: string, callback: (err: undefined | any) => void) => void;
export type TCreateRoom = (roomId: string) => void;
export type TJoinRoom = (roomId: string) => void;
export type TDisconnect = () => void;

type UsePeerConnectionReturn = ReturnType<() => [
  boolean,
  string,
  TCreateRoom,
  TJoinRoom,
  TDisconnect
]>;

interface UsePeerConnectionProps {
  userId: string;
}

const RTCConfiguration: RTCConfiguration = {
  iceServers: [{'urls': 'stun:stun.l.google.com:19302'}]
}

export const usePeerConnection = ({ userId }: UsePeerConnectionProps): UsePeerConnectionReturn => {
  const signalChannel = useRef<WebSocket>();
  const [roomId, setRoomId] = useState<string>("");
  const localPeerConnection = useRef<RTCPeerConnection>(new RTCPeerConnection(RTCConfiguration));
  const [remotePeerConnectionMap, setRemotePeerConnectionMap] = useState<Map<string, RTCPeerConnection>>(new Map());

  const exitRoom = useCallback(() => {
    // signalChannel.current?.close();
    // setRoomId("");
  },[])

  const sendSignal = useCallback((signal: Signal) => {
    const encode = JSON.stringify(signal);
    signalChannel.current?.send(encode);
  },[])

  const createRoom = useCallback((roomId: string) => {
    const signal: Signal = {
      roomId,
      type: 'CreateRoom'
    }
    sendSignal(signal)
  },[sendSignal])

  const joinRoom = useCallback((roomId: string) => {
    const signal: Signal = {
      roomId,
      type: 'JoinRoom'
    }
    sendSignal(signal)
  },[sendSignal])

  const creteOffer = useCallback((roomId: string, callback: (roomId: string, offer: RTCSessionDescriptionInit) => void) => {
    if (!localPeerConnection) return;
    localPeerConnection.current.createOffer()
      .then((description) => 
        localPeerConnection.current.setLocalDescription(description)
          .then(() => callback(roomId, description))
          .catch(() => console.log("local peer connection couldn't set description"))
      )
      .catch(() => console.error("local peer connection couldn't create offer description"))
  },[])

  const sendOfferSignal = useCallback((roomId: string, offer: RTCSessionDescriptionInit) => {
    const signal: SignalOffer = {
      roomId,
      type: 'Offer',
      data: offer,
      sender: userId
    }
    sendSignal(signal);
  },[sendSignal, userId])

  const createAnswer = useCallback((offer: RTCSessionDescriptionInit, callback: (answer: RTCSessionDescriptionInit | undefined) => void) => {
    if (!localPeerConnection) return;
     localPeerConnection.current.setRemoteDescription(offer);
     localPeerConnection.current.createAnswer()
      .then((answer) => 
        localPeerConnection.current.setLocalDescription(answer)
          .then(() => callback(answer))
          .catch(() => callback(undefined))
        )
      .catch(() => callback(undefined))
  },[])

  const sendAnswerSignal = useCallback((roomId: string, answer: RTCSessionDescriptionInit) => {
    const signal: Signal = {
      roomId,
      type: 'Answer',
      data: answer,
    }
    const encode = JSON.stringify(signal);
    // signalChannel?.send(encode);
    signalChannel.current?.send(encode);
  },[])

  const onMessage = useCallback((event: MessageEvent<any>) => {
    const { data } = event;
    const decode: Signal = JSON.parse(data);
    console.log(decode);
    
    switch (decode.type) {
      case "ResponseRoom":
        setRoomId(decode.roomId);
        break;
      case "Offer":
        if (!decode.data) break;
        createAnswer(decode.data as RTCSessionDescriptionInit, (answer) => {
          if (answer) {
            sendAnswerSignal(decode.roomId, answer);
            // set offer to remote peer connection
          }
        })
        break;
      case "Answer":
        if (!decode.data) break;
          // set offer to remote peer connection
        break;
      default:
        break;
    }
  },[createAnswer, sendAnswerSignal])

  useEffect(() => {
    let ws: WebSocket;
    try {
      ws = new WebSocket(`${config.signalHost}?userId=${userId}`);
      ws.addEventListener('message',onMessage);
      // setSignalChannel(ws);
      signalChannel.current = ws;
    } catch (error) {
      console.error(error);
    }
    return () => {
      console.log("close");
      ws.close();
    }
  }, [onMessage, userId]);

  useEffect(() => {
    if (roomId !== "") creteOffer(roomId, sendOfferSignal)
  }, [creteOffer, roomId, sendOfferSignal]);

  return [
    // signalChannel ? Boolean(signalChannel.readyState === 1) : false,
    signalChannel.current ? Boolean(signalChannel.current.readyState === 1) : false,
    roomId,
    createRoom,
    joinRoom,
    exitRoom
  ];
}