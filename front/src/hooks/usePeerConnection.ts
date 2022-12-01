import { useCallback, useEffect, useRef, useState } from "react";
import { Signal, SignalAnswer, SignalOffer } from 'common';
import { config } from "../config";
import { createPeerConnection } from "../funcs/createPeerConnection";

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

// const RTCConfiguration: RTCConfiguration = {
//   iceServers: [{'urls': 'stun:stun.l.google.com:19302'}]
// }

export const usePeerConnection = ({ userId }: UsePeerConnectionProps): UsePeerConnectionReturn => {
  const signalChannel = useRef<WebSocket>();
  const [roomId, setRoomId] = useState<string>("");
  const localPeerConnection = useRef<RTCPeerConnection>(createPeerConnection());
  const remotePeerConnectionMap = useRef<Map<string, RTCPeerConnection>>(new Map());

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
    console.log("CreateOffer");
    
    const peerConnection = createPeerConnection();
    peerConnection.createOffer().then((description) => 
      peerConnection.setLocalDescription(description)
        .then(() => callback(roomId, description))
        .catch(() => console.log("local peer connection couldn't set description"))
    ).catch(() => console.error("local peer connection couldn't create offer description"))
    remotePeerConnectionMap.current.set(userId, peerConnection);
  },[userId])

  const sendOfferSignal = useCallback((roomId: string, offer: RTCSessionDescriptionInit) => {
    const signal: SignalOffer = {
      roomId,
      type: 'Offer',
      data: offer,
      sender: userId
    }
    sendSignal(signal);
  },[sendSignal, userId])

  const sendAnswerSignal = useCallback((roomId: string, sender: string, receiver: string, answer: RTCSessionDescriptionInit) => {
    const signal: SignalAnswer = {
      roomId,
      type: 'Answer',
      data: answer,
      sender,
      receiver
    }
    const encode = JSON.stringify(signal);
    // signalChannel?.send(encode);
    signalChannel.current?.send(encode);
  },[])

  const onOffer = useCallback((signalOffer: SignalOffer) => {
    if (!signalOffer.data) return;
    const peerConnection = createPeerConnection();
    peerConnection.setRemoteDescription(new RTCSessionDescription(signalOffer.data));
    peerConnection.createAnswer().then((answer) =>
      peerConnection.setLocalDescription(answer)
        .then(() => sendAnswerSignal(signalOffer.roomId, userId, signalOffer.sender, answer))
        .catch(() => {})
    ).catch(() => {});
    remotePeerConnectionMap.current.set(signalOffer.sender, peerConnection)
  },[sendAnswerSignal, userId])

  const onAnswer = useCallback((signalAnswer: SignalAnswer) => {
    if (!signalAnswer.data) return;
    remotePeerConnectionMap.current
      .get(signalAnswer.sender)
      ?.setRemoteDescription(new RTCSessionDescription(signalAnswer.data));
  },[])

  const onMessage = useCallback((event: MessageEvent<any>) => {
    const { data } = event;
    const decode: Signal = JSON.parse(data);
    
    switch (decode.type) {
      case "ResponseRoom":
        setRoomId(decode.roomId);
        break;
      case "Offer":
        const signalOffer: SignalOffer = decode as SignalOffer;
        onOffer(signalOffer);
        break;
      case "Answer":
        const signalAnswer: SignalAnswer = decode as SignalAnswer;
        onAnswer(signalAnswer)
        break;
      default:
        break;
    }
  },[onAnswer, onOffer])

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

  useEffect(() => {
    setInterval(() => {
      console.log(remotePeerConnectionMap);
    },5000)
  }, []);

  return [
    // signalChannel ? Boolean(signalChannel.readyState === 1) : false,
    signalChannel.current ? Boolean(signalChannel.current.readyState === 1) : false,
    roomId,
    createRoom,
    joinRoom,
    exitRoom
  ];
}