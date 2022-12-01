const RTCConfiguration: RTCConfiguration = {
  iceServers: [{'urls': 'stun:stun.l.google.com:19302'}]
}

export const createPeerConnection = () => {
  const peerConnection = new RTCPeerConnection(RTCConfiguration);

  return peerConnection;
}
