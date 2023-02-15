import { useEffect, useRef, useState } from "react";
import { Signal, AnswerSignal, OfferSignal, ResponseRoomSignal, IcecandidateSignal } from 'common';
import { config } from "../config";
import { createPeerConnection } from "../funcs/createPeerConnection";

export type TCreateOffer = (roomId: string, callback: (err: undefined | any) => void) => void;
export type TCreateRoom = (roomId: string) => void;
export type TJoinRoom = (roomId: string) => void;
export type TDisconnect = () => void;

type UsePeerConnectionReturn = ReturnType<() => [
  Map<string, MediaStream>,
  WebSocket | undefined,
  string,
  TCreateRoom,
  TJoinRoom,
  TDisconnect
]>;

// const RTCConfiguration: RTCConfiguration = {
//   iceServers: [{'urls': 'stun:stun.l.google.com:19302'}]
// }

export const usePeerConnection = (userId: string, localStream?: MediaStream): UsePeerConnectionReturn => {
  const signalChannel = useRef<WebSocket>();
  const [roomId, setRoomId] = useState<string>("");
  const [streamMap, setStreamMap] = useState<Map<string, MediaStream>>(new Map());
  const remotePeerConnectionMap = useRef<Map<string, RTCPeerConnection>>(new Map());

  const exitRoom = () => {
    // signalChannel.current?.close();
    sendSignal({
      roomId,
      type: 'ExitRoom'
    })
    setRoomId("");
    setStreamMap(new Map());
    if (remotePeerConnectionMap.current) {
      remotePeerConnectionMap.current.forEach((peer) => {
        peer.close();
      })
    }
  }

  const sendSignal = (signal: Signal) => {
    const encode = JSON.stringify(signal);
    signalChannel.current?.send(encode);
  }

  const onTrack = (userId: string, stream: MediaStream) => {
    setStreamMap((streamMap) => {
      return new Map(streamMap.set(userId, stream));
    })
  }

  const onDisconnect = (userId: string) => {
    setStreamMap((prev) => {
      const newState = new Map(prev);
      newState.delete(userId);
      return newState;
    })
  }

  const creteOffer = (roomId: string, receiver: string, callback: (roomId: string, receiver: string, offer: RTCSessionDescriptionInit) => void) => {
    if(!signalChannel.current) return;
    const peerConnection = createPeerConnection({
      onTrack,
      onDisconnect,
      signalingChannel: signalChannel.current,
      roomId,
      sender: userId,
      receiver
    });
    localStream?.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });
    peerConnection.createOffer().then((description) => {
      peerConnection.setLocalDescription(description)
        .then(() => {
          callback(roomId, receiver, description);
          remotePeerConnectionMap.current.set(receiver, peerConnection);
        })
        .catch((e) => { console.log(e)})
    }).catch((e) => { throw new Error(e) })
  }

  const sendOfferSignal = (roomId: string, receiver: string, offer: RTCSessionDescriptionInit) => {
    const signal: OfferSignal = {
      roomId,
      type: 'Offer',
      data: offer,
      sender: userId,
      receiver,
    }
    sendSignal(signal);
  }

  const sendAnswerSignal = (roomId: string, sender: string, receiver: string, answer: RTCSessionDescriptionInit) => {
    const signal: AnswerSignal = {
      roomId,
      type: 'Answer',
      data: answer,
      sender,
      receiver
    }
    const encode = JSON.stringify(signal);
    signalChannel.current?.send(encode);
  }

  const onOffer = (offerSignal: OfferSignal) => {
    if (!offerSignal.data || !signalChannel.current) return;
    const peerConnection = createPeerConnection({
      signalingChannel: signalChannel.current, 
      roomId: offerSignal.roomId,
      receiver: offerSignal.sender,
      sender: userId,
      onTrack,
      onDisconnect,
    });
    localStream?.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });
    peerConnection.setRemoteDescription(new RTCSessionDescription(offerSignal.data)).then(() => {
      peerConnection.createAnswer().then((answer) =>
        peerConnection.setLocalDescription(answer)
          .then(() => sendAnswerSignal(offerSignal.roomId, userId, offerSignal.sender, answer))
          .catch((e) => { console.error(e)})
      ).catch((e) => { console.error(e) });
    }).finally(() => {
      remotePeerConnectionMap.current.set(offerSignal.sender, peerConnection)
    })
  }

  const onAnswer = (signalAnswer: AnswerSignal) => {
    if (!signalAnswer.data) return;
    remotePeerConnectionMap.current
      .get(signalAnswer.sender)
      ?.setRemoteDescription(new RTCSessionDescription(signalAnswer.data)).catch((e) => {
        console.error(e);
      });
  }

  const onResponseRoom = (signal: ResponseRoomSignal) => {
    setRoomId(signal.roomId);
    signal.participants.forEach((id) => {
      creteOffer(signal.roomId, id, sendOfferSignal);
    })
  }

  const onIcecandidate = (signal: IcecandidateSignal) => {
    remotePeerConnectionMap.current.get(signal.sender)?.addIceCandidate(signal.data);
  }

  const onMessage = (event: MessageEvent<any>) => {
    const { data } = event;
    const decoded: Signal = JSON.parse(data);
    switch (decoded.type) {
      case "ResponseRoom":
        onResponseRoom(decoded as ResponseRoomSignal);
        break;
      case "Offer":
        onOffer(decoded as OfferSignal);
        break;
      case "Answer":
        onAnswer(decoded as AnswerSignal);
        break;
      case "Icecandidate":
        onIcecandidate(decoded as IcecandidateSignal);
        break;
      default:
        break;
    }
  }

  const createRoom = (roomId: string) => {
    console.log("create Room");
    
    const signal: Signal = {
      roomId,
      type: 'CreateRoom'
    }
    sendSignal(signal)
  }

  const joinRoom = (roomId: string) => {
    const signal: Signal = {
      roomId,
      type: 'JoinRoom'
    }
    sendSignal(signal)
  }


  useEffect(() => {
    if (!localStream) return;
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
  }, [onMessage, userId, localStream]);

  return [
    streamMap,
    signalChannel.current,
    roomId,
    createRoom,
    joinRoom,
    exitRoom
  ];
}