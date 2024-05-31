
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

## PORT

- front 5173
- signal-server 8081

## Sequence diagram

```mermaid
sequenceDiagram
    Participant A as Peer A
    Participant B as Peer B
    Participant S as Signal Server
    Participant T as Sturn Server
    autonumber

    A ->>+ S : create room
    activate A
    S -->>- A: room info(name, participants)
    A ->> A: create local stream
    deactivate A

    B ->>+ S : join room
    activate B
    S -->>- B: room info(name, participants)
    B ->> B: create local stream
    alt participants > 2
        B ->> B: create offer
        B ->> S: send offer
        activate S
        deactivate B
        S -->> A: send B offer
        deactivate S
        activate A
        A ->> A : create peer B connection
        A ->> A : create answer B
        A ->> S : send answer
        deactivate A
        activate S
        S -->> B: send A answer
        deactivate S
        activate B
        B ->> B: create peer A connection
        deactivate B
        A ->> T: request Public Peer A IP
        B ->> T: request Public Peer B IP
        T -->> A: response Public Peer A IP
        T -->> B: response Public Peer B IP
        A ->> S : send icecandidate
        B ->> S : send icecandidate
        S -->> B : send icecandidate
        S -->> A : send icecandidate
        A ->> B : send tracks
        B ->> A : send tracks
    end
```

## Usage

you can create or join the name of the room you want to chat with. If you are connected to the other person, you can see remote video screen.

## Do you want to publish?

If you want to expand this project and run it on a real server, you will need to use the address of the actual workable turn server for the setting of the RTC Configuration in the front project, and it is recommended that you have an address with HTTPS protocol applied.

## Demo video
![DEMO](./webrtc_demo.gif)
