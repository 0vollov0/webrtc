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
  ondisconnect: (participant: string) => void;
}
const createPeerConnection = ({
  room,
  receiver,
  localStream,
  ontrack,
  ondisconnect,
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
    if (peerConnection.connectionState === 'disconnected') ondisconnect(receiver);
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
    console.log('ontrack', participant);
    
    const [remoteStream] = event.streams;
    setRemoteStreams((prev) => new Map(prev.set(participant, remoteStream)));
  }, [])

  const ondisconnect = useCallback((participant: string) => {
    console.log('ondisconnect', participant);
    peerConnections.current.delete(participant);
    setRemoteStreams((prev) => {
      const newRemoteStreams = new Map(prev);
      newRemoteStreams.delete(participant);
      return newRemoteStreams;
    });
  }, [])

  /* const onRoomInfo = useCallback((message: never) => {
    const roomInfo: RoomInfo = message;
    roomInfo.participants.forEach(async (participant) => {
      const peerConnection = createPeerConnection({ room, receiver: participant, localStream, ontrack, ondisconnect });
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      peerConnections.current.set(participant, peerConnection);
      signalConnection.emit('offer-signal', {
        room,
        offer,
        receiver: participant,
      });
    })
  }, [localStream, ondisconnect, ontrack, room]) */

  useEffect(() => {
    if (room.length) {
      signalConnection.emit('room-info', {
        name: room,
      });
    } else {
      Array.from(peerConnections.current.values()).forEach((peer) => peer.close());
    }
  }, [room])

  useEffect(() => {
    if (!localStream || !room.length) return;
    signalConnection.on(`room-info`, (message) => {
      const roomInfo: RoomInfo = message;
      roomInfo.participants.forEach(async (participant) => {
        const peerConnection = createPeerConnection({ room, receiver: participant, localStream, ontrack, ondisconnect });
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

    return () => {
      signalConnection.removeListener('room-info');
      signalConnection.removeListener(`answer-signal-${room}-${clientId}`);
      signalConnection.removeListener(`icecandidate-signal-${room}-${clientId}`);
    }
  }, [clientId, localStream, ontrack, room, ondisconnect])

  useEffect(() => {
    if (!localStream || !room.length) return;
    signalConnection.on(`offer-signal-${room}-${clientId}`, async (message) => {
      try {
        const receiveOffer: ReceiveOffer = message;
        const peerConnection = createPeerConnection({ room, receiver: receiveOffer.sender, localStream, ontrack, ondisconnect });
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

    return () => {
      signalConnection.removeListener(`offer-signal-${room}-${clientId}`);
    }
  }, [clientId, localStream, ontrack, room, ondisconnect])

  return (
    !room.length
    ? <></>
    : <VideoChatFrame>
        {
          Array.from(remoteStreams.entries()).map(([participant, stream]) => 
            <StreamView key={participant} participant={participant} stream={stream} />
          )
        }
        <LocalStream stream={localStream} />
      </VideoChatFrame>
  )
    /* {
      !room.length ? <></> : (
        <VideoChatFrame>
          {
            Array.from(remoteStreams.entries()).map(([participant, stream]) => 
              <StreamView key={participant} participant={participant} stream={stream} />
            )
          }
          <LocalStream stream={localStream} />
        </VideoChatFrame>
      )
    } */
}