import { useEffect, useRef } from "react";
import { signalConnection } from "../stores/signal-store";
import { useAppSelector } from "../hooks";

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
  localStream: MediaStream,
}
const createPeerConnection = ({
  room,
  receiver,
  localStream
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
  peerConnection.addEventListener('connectionstatechange', () => {
    if (peerConnection.connectionState === 'connected') {
      console.log('Peers connected');
    }
  })
  return peerConnection;
}

interface VideoChatProps {
  localStream: MediaStream;
}

export const VideoChat: React.FC<VideoChatProps> = ({ localStream }) => {
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map())
  const room = useAppSelector(state => state.signal.room);
  const clientId = useAppSelector(state => state.signal.clientId);

  useEffect(() => {
    setTimeout(() => {
      signalConnection.emit('room-info', {
        name: room,
      });
    }, 1000);
  }, [room])

  useEffect(() => {
    signalConnection.on(`room-info`, (message) => {
      const roomInfo: RoomInfo = message;
      roomInfo.participants.forEach(async (participant) => {
        const peerConnection = createPeerConnection({ room, receiver: participant, localStream });
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
  }, [clientId, localStream, room])

  useEffect(() => {
    signalConnection.on(`offer-signal-${room}-${clientId}`, async (message) => {
      try {
        const receiveOffer: ReceiveOffer = message;
        const peerConnection = createPeerConnection({ room, receiver: receiveOffer.sender, localStream });
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
  }, [clientId, localStream, room])

  return (
    <></>
  )
}