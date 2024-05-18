import { IcecandidateSignal } from "common";

const RTCConfiguration: RTCConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
    },
  ],
};

export interface CreatePeerConnectionProps {
  signalingChannel: WebSocket;
  roomId: string;
  sender: string;
  receiver: string;
  onTrack: (userId: string, stream: MediaStream) => void;
  onDisconnect: (userId: string) => void;
  onDataChannel: (event: RTCDataChannelEvent) => void;
}


export const createPeerConnection = ({
  onTrack,
  onDisconnect,
  receiver,
  roomId,
  sender,
  signalingChannel,
  onDataChannel
}:CreatePeerConnectionProps) => {
  const peerConnection = new RTCPeerConnection(RTCConfiguration);

  peerConnection.addEventListener('icecandidate', (event) => {
    if (event.candidate) {
      const signal: IcecandidateSignal = {
        type: 'Icecandidate',
        sender,
        receiver,
        roomId,
        data: event.candidate
      }
      signalingChannel.send(JSON.stringify(signal))
    }
  })

  peerConnection.addEventListener('connectionstatechange', (event) => {
    if (peerConnection.connectionState === 'connected') {
      // Peers connected!
      console.log('Peers connected!');
    } else if (peerConnection.connectionState === 'disconnected') {
      onDisconnect(receiver);
    }
  })

  peerConnection.addEventListener('track', (event) => {
    const [remoteStream] = event.streams;
    onTrack(receiver, remoteStream);
  })

  peerConnection.addEventListener('datachannel', onDataChannel)

  return peerConnection;
}
