import { useCallback, useEffect, useRef, useState } from "react";
import { Signal, AnswerSignal, OfferSignal, ResponseRoomSignal } from 'common';
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
  const localPeerConnection = useRef<RTCPeerConnection>();
  const remotePeerConnectionMap = useRef<Map<string, RTCPeerConnection>>(new Map());

  const exitRoom = useCallback(() => {
    signalChannel.current?.close();
    setRoomId("");
  },[])

  const sendSignal = useCallback((signal: Signal) => {
    const encode = JSON.stringify(signal);
    signalChannel.current?.send(encode);
  },[])

  const creteOffer = useCallback((roomId: string, userId: string, callback: (roomId: string, receiver: string, offer: RTCSessionDescriptionInit) => void) => {
    if(!signalChannel.current) return;
    const peerConnection = createPeerConnection(signalChannel.current);
    peerConnection.createOffer().then((description) => {
      peerConnection.setLocalDescription(description)
        .then(() => {
          callback(roomId, userId, description);
          remotePeerConnectionMap.current.set(userId, peerConnection);
        })
        .catch((e) => { throw new Error(e) })
    }).catch((e) => { throw new Error(e) })
  },[])

  const sendOfferSignal = useCallback((roomId: string, receiver: string, offer: RTCSessionDescriptionInit) => {
    const signal: OfferSignal = {
      roomId,
      type: 'Offer',
      data: offer,
      sender: userId,
      receiver,
    }
    sendSignal(signal);
  },[sendSignal, userId])

  const sendAnswerSignal = useCallback((roomId: string, sender: string, receiver: string, answer: RTCSessionDescriptionInit) => {
    const signal: AnswerSignal = {
      roomId,
      type: 'Answer',
      data: answer,
      sender,
      receiver
    }
    const encode = JSON.stringify(signal);
    signalChannel.current?.send(encode);
  },[])

  const onOffer = useCallback((offerSignal: OfferSignal) => {
    if (!offerSignal.data || !signalChannel.current) return;
    const peerConnection = createPeerConnection(signalChannel.current);
    peerConnection.setRemoteDescription(new RTCSessionDescription(offerSignal.data)).then(() => {
      peerConnection.createAnswer().then((answer) =>
        peerConnection.setLocalDescription(answer)
          .then(() => sendAnswerSignal(offerSignal.roomId, userId, offerSignal.sender, answer))
          .catch((e) => { console.error(e)})
      ).catch((e) => { console.error(e) });
    }).finally(() => {
      remotePeerConnectionMap.current.set(offerSignal.sender, peerConnection)
    })
  },[sendAnswerSignal, userId])

  const onAnswer = useCallback((signalAnswer: AnswerSignal) => {
    if (!signalAnswer.data) return;
    console.log(signalAnswer.sender,"???");
    
    remotePeerConnectionMap.current
      .get(signalAnswer.sender)
      ?.setRemoteDescription(new RTCSessionDescription(signalAnswer.data)).catch((e) => {
        console.error(e);
      });
  },[])

  const onResponseRoom = useCallback((signal: ResponseRoomSignal) => {
    setRoomId(signal.roomId);
    signal.participants.forEach((id) => {
      creteOffer(signal.roomId, id, sendOfferSignal);
    })
  },[creteOffer, sendOfferSignal])

  const onMessage = useCallback((event: MessageEvent<any>) => {
    const { data } = event;
    const decode: Signal = JSON.parse(data);
    console.log("onMessage", decode);
    
    switch (decode.type) {
      case "ResponseRoom":
        onResponseRoom(decode as ResponseRoomSignal);
        break;
      case "Offer":
        onOffer(decode as OfferSignal);
        break;
      case "Answer":
        onAnswer(decode as AnswerSignal)
        break;
      default:
        break;
    }
  },[onAnswer, onOffer, onResponseRoom])

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

  useEffect(() => {
    if (signalChannel.current) return;
    let ws: WebSocket;
    try {
      ws = new WebSocket(`${config.signalHost}?userId=${userId}`);
      ws.addEventListener('message',onMessage);
      signalChannel.current = ws;
    } catch (error) {
      console.error(error);
    }
    return () => {
    }
  }, [onMessage, userId]);

  return [
    // signalChannel ? Boolean(signalChannel.readyState === 1) : false,
    signalChannel.current ? Boolean(signalChannel.current.readyState === 1) : false,
    roomId,
    createRoom,
    joinRoom,
    exitRoom
  ];
}