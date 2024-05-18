import { useRef, useState } from "react";
import { Signal, AnswerSignal, OfferSignal, ResponseRoomSignal, IcecandidateSignal } from 'common';
import { config } from "../config";
import { createPeerConnection } from "../funcs/createPeerConnection";

export type TCreateOffer = (roomId: string, callback: (err: undefined | any) => void) => void;
export type TCreateRoom = (roomId: string) => void;
export type TJoinRoom = (roomId: string) => void;
export type TDisconnect = () => void;

type UsePeerConnectionReturn = ReturnType<() => [
  Map<string, MediaStream>,
  string,
  TCreateRoom,
  TJoinRoom,
  TDisconnect,
  React.MutableRefObject<Map<string, RTCDataChannel>>
]>;


export const usePeerConnection = (userId: string, onDataChannelMessage: (event: MessageEvent<any>) => void, localStream?: MediaStream): UsePeerConnectionReturn => {
  const signalChannel = useRef<WebSocket>();
  const [roomId, setRoomId] = useState<string>("");
  const [streamMap, setStreamMap] = useState<Map<string, MediaStream>>(new Map());
  const remotePeerConnectionMap = useRef<Map<string, RTCPeerConnection>>(new Map());
  const dataChannels = useRef<Map<string, RTCDataChannel>>(new Map());
  const remoteDataChannel = useRef<Map<string, RTCDataChannel>>(new Map());

  const setUpDataChannel = (peerConnection: RTCPeerConnection) => {
    const dataChannel = peerConnection.createDataChannel(userId);
    dataChannels.current.set(dataChannel.label,dataChannel);
    dataChannel.addEventListener('message',onDataChannelMessage);
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

  const onDataChannel = (event: RTCDataChannelEvent) => {
    const dataChannel = event.channel;
    remoteDataChannel.current.set(dataChannel.label, dataChannel);
  }

  const creteOffer = (roomId: string, receiver: string, callback: (roomId: string, receiver: string, offer: RTCSessionDescriptionInit) => void) => {
    if(!signalChannel.current) return;
    const peerConnection = createPeerConnection({
      onTrack,
      onDisconnect,
      signalingChannel: signalChannel.current,
      roomId,
      sender: userId,
      receiver,
      onDataChannel
    });
    setUpDataChannel(peerConnection);

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
      onDataChannel
    });
    setUpDataChannel(peerConnection);

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

  const connectSignalServer = (onopen: () => void) => {
    if (signalChannel.current) return;
    try {
      const ws = new WebSocket(`${config.signalHost}?userId=${userId}`);
      ws.addEventListener('message',onMessage);
      ws.onopen = onopen;
      ws.onclose = () => {
        ws.removeEventListener('message',onMessage);
      }
      signalChannel.current = ws;
    } catch (error) {
      console.error(error);
    }
  }

  const createRoom = (roomId: string) => {
    connectSignalServer(() => {
      const signal: Signal = {
        roomId,
        type: 'CreateRoom'
      }
      sendSignal(signal)
    })
  }

  const joinRoom = (roomId: string) => {
    connectSignalServer(() => {
      const signal: Signal = {
        roomId,
        type: 'JoinRoom'
      }
      sendSignal(signal)
    })
  }

  const exitRoom = () => {
    sendSignal({
      roomId,
      type: 'ExitRoom'
    });
    setRoomId("");
    setStreamMap(new Map());
    if (remotePeerConnectionMap.current) {
      remotePeerConnectionMap.current.forEach((peer) => {
        peer.close();
      })
    }
    signalChannel.current?.close();
    signalChannel.current = undefined;
  }

  return [
    streamMap,
    roomId,
    createRoom,
    joinRoom,
    exitRoom,
    remoteDataChannel
  ];
}