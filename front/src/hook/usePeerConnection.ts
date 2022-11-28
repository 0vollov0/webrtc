import { useCallback, useEffect, useRef, useState } from "react";
import { Signal } from 'common';
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

const RTCConfiguration: RTCConfiguration = {
  iceServers: [{'urls': 'stun:stun.l.google.com:19302'}]
}

export const usePeerConnection = (): UsePeerConnectionReturn => {
  const signalChannel = useRef<WebSocket>();
  const [roomId, setRoomId] = useState<string>("");
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection>();

  const exitRoom = useCallback(() => {
    // signalChannel.current?.close();
    // setRoomId("");
  },[])

  useEffect(() => {
    setPeerConnection(new RTCPeerConnection(RTCConfiguration));
    return () => {
      // disconnect();
    }
  }, []);

  const sendCreateRoomSignal = useCallback((roomId: string, offer: RTCSessionDescriptionInit) => {
    const signal: Signal = {
      roomId,
      type: 'CreateRoom',
    }
    const encode = JSON.stringify(signal);
    signalChannel.current?.send(encode);
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

  const createAnswer = useCallback((offer: RTCSessionDescriptionInit, callback: (answer: RTCSessionDescriptionInit | undefined) => void) => {
    if (!peerConnection) return;
    peerConnection.setRemoteDescription(offer);
    peerConnection.createAnswer()
      .then((answer) => 
        peerConnection.setLocalDescription(answer)
          .then(() => callback(answer))
          .catch(() => callback(undefined))
        )
      .catch(() => callback(undefined))
  },[peerConnection])

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

    switch (decode.type) {
      case "ResponseRoom":
        setRoomId(decode.roomId);
        break;
      case "Offer":
        if (!decode.data) break;
        createAnswer(decode.data as RTCSessionDescriptionInit, (answer) => {
          if (answer) sendAnswerSignal(decode.roomId, answer);
        })
        break;
      default:
        break;
    }
  },[createAnswer, sendAnswerSignal])

  useEffect(() => {
    let ws: WebSocket;
    try {
      ws = new WebSocket(`${config.signalHost}?userId=${new Date().getTime()}`);
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
  }, [onMessage]);

  return [
    // signalChannel ? Boolean(signalChannel.readyState === 1) : false,
    signalChannel.current ? Boolean(signalChannel.current.readyState === 1) : false,
    roomId,
    createRoom,
    joinRoom,
    exitRoom
  ];
}