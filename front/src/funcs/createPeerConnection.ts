const RTCConfiguration: RTCConfiguration = {
  iceServers: [{'urls': 'stun:stun.l.google.com:19302'}]
}

export const createPeerConnection = (signalingChannel: WebSocket) => {
  const peerConnection = new RTCPeerConnection(RTCConfiguration);
  peerConnection.addEventListener('icecandidate', event => {
    console.log("icecandidate", event);
    if (event.candidate) {
        // signalingChannel.send(JSON.stringify({'new-ice-candidate': event.candidate}));
    }
  });

  peerConnection.addEventListener('connectionstatechange', event => {
    if (peerConnection.connectionState === 'connected') {
      // Peers connected!
      console.log('Peers connected!');
    }
  });
  return peerConnection;
}
