
## WebRTC Demonstration Project

This project demonstrates video chat feature with WebRTC protocol.


## How to run

install dependencies in ./server-signal and ./front
```
npm or yarn install
```

run signal server in server-signal directory
```
npm run start or yarn start
```

run front
```
npm run dev or yarn dev
```

## Sequence diagram

```mermaid
sequenceDiagram
    participant A as Client A
    participant B as Client B
    participant S as Signal Server
    B->>S : Create Room(connect websocket)
    A->>S : Join Room(connect websocket)
    B->>S : Send Offer
    S-->>A : Send Offer
    A->>A : Store Remote Peer
    A->>A : Create Answer
    A->>S : Send Answer
    S-->>B : Send Answer
    B->>B : Store Remote Peer
    B->>S : Send Icecandidate
    A->>S : Send Icecandidate
    S-->>B : Send Icecandidate
    B->>B : Enable Remote Peer
    S-->>A : Send Icecandidate
    A->>A : Enable Remote Peer
```

## Usage

you can create or join the name of the room you want to chat with. If you are connected to the other person, you can see remote video screen.

## Do you want to publish?

If you want to expand this project and run it on a real server, you will need to use the address of the actual workable turn server for the setting of the RTC Configuration in the front project, and it is recommended that you have an address with HTTPS protocol applied.
