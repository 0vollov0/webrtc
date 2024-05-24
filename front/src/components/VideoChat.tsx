import { useCallback, useEffect, useRef, useState } from "react";
import { signalConnection } from "../stores/signal-store";
import { useAppSelector } from "../hooks";
import { StreamView } from "./StreamView";
import { LocalStream } from "./LocalStream";
import styled from "styled-components";

const VideoChatFrame = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px 0px;
`

interface ReceiveOffer {
  offer: RTCSessionDescriptionInit;
  room: string;
  sender: string;
  receiver: string;
}

interface ReceiveAnswer {
  answer: RTCSessionDescriptionInit;
  room: string;
  sender: string;
  receiver: string;
}

interface ReceiveIceCandidate {
  iceCandidate: RTCIceCandidate;
  room: string;
  sender: string;
  receiver: string;
}

interface RoomInfo {
  participants: string[];
}

const urls = ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"];

interface CreatePeerConnectionProp {
  room: string;
  receiver: string;
  localStream: MediaStream;
  ontrack: (event: RTCTrackEvent, participant: string) => void;
}
const createPeerConnection = ({
  room,
  receiver,
  localStream,
  ontrack,
}: CreatePeerConnectionProp) => {
  
  const peerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls,
      },
    ],
  });
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  })
  peerConnection.onicecandidate = ((event) => {
    if (event.candidate === null) return;
    signalConnection.emit('icecandidate-signal', {
      iceCandidate: event.candidate,
      room,
      receiver,
    });
  })
  peerConnection.addEventListener('icecandidateerror', () => {
    console.log('icecandidateerror');
    
  })
  peerConnection.addEventListener('connectionstatechange', () => {
    // if (peerConnection.connectionState === 'connected') {
    //   console.log('Peers connected');
    // }
    console.log(peerConnection.connectionState);
    
  })
  peerConnection.ontrack = (event) => ontrack(event, receiver);
  return peerConnection;
}

interface VideoChatProps {
  localStream?: MediaStream;
}

export const VideoChat: React.FC<VideoChatProps> = ({ localStream }) => {
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const room = useAppSelector(state => state.signal.room);
  const clientId = useAppSelector(state => state.signal.clientId);
  const deviceState = useAppSelector(state => state.device.deviceState);
  const screenDirection = useAppSelector(state => state.screen.direction);
  const screenSize = useAppSelector(state => state.screen.size);
  
  const ontrack = useCallback((event: RTCTrackEvent, participant: string) => {
    const [remoteStream] = event.streams;
    // setRemoteStreams((prev) => new Map([...prev, [participant, remoteStream]]))
    setRemoteStreams((prev) => new Map(prev.set(participant, remoteStream)));
  }, [])

  useEffect(() => {
    setTimeout(() => {
      signalConnection.emit('room-info', {
        name: room,
      });
    }, 1000);
  }, [room])

  useEffect(() => {
    if (!localStream) return;
    signalConnection.on(`room-info`, (message) => {
      const roomInfo: RoomInfo = message;
      roomInfo.participants.forEach(async (participant) => {
        const peerConnection = createPeerConnection({ room, receiver: participant, localStream, ontrack });
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        peerConnections.current.set(participant, peerConnection);
        signalConnection.emit('offer-signal', {
          room,
          offer,
          receiver: participant,
        });
      })
    })
    signalConnection.on(`answer-signal-${room}-${clientId}`, async (message) => {
      try {
        const receiveAnswer: ReceiveAnswer = message;
        const remoteDesc = new RTCSessionDescription(receiveAnswer.answer);
        await peerConnections.current.get(receiveAnswer.sender)?.setRemoteDescription(remoteDesc);
      } catch (error) {
        console.error(error);
      }
    })
    signalConnection.on(`icecandidate-signal-${room}-${clientId}`, async (message) => {
      try {
        const receiveIceCandidate: ReceiveIceCandidate = message;
        await peerConnections.current.get(receiveIceCandidate.sender)?.addIceCandidate(receiveIceCandidate.iceCandidate);
      } catch (error) {
        console.error(error);
      }
    })
  }, [clientId, localStream, ontrack, room])

  useEffect(() => {
    if (!localStream) return;
    signalConnection.on(`offer-signal-${room}-${clientId}`, async (message) => {
      try {
        const receiveOffer: ReceiveOffer = message;
        const peerConnection = createPeerConnection({ room, receiver: receiveOffer.sender, localStream, ontrack });
        peerConnection.setRemoteDescription(new RTCSessionDescription(receiveOffer.offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        peerConnections.current.set(receiveOffer.sender, peerConnection);
        signalConnection.emit('answer-signal', {
          room,
          answer,
          receiver: receiveOffer.sender,
        })
      } catch (error) {
        console.error(error);
      }
    })
  }, [clientId, localStream, ontrack, room])

  return (
    <VideoChatFrame>
      {
        Array.from(remoteStreams.entries()).map(([participant, stream]) => 
          <StreamView key={participant} participant={participant} stream={stream} />
        )
      }
      <LocalStream stream={localStream} />
    </VideoChatFrame>
  )
}