export const createDataChannel = (peerConnection: RTCPeerConnection) => {
  peerConnection.addEventListener('datachannel', (event) => {
    const dataChannel = event.channel;
  })
  
  const dataChannel = peerConnection.createDataChannel('chatChannel');

  dataChannel.addEventListener('open', (event) => {

  })

  dataChannel.addEventListener('close', (event) => {
    
  })
}