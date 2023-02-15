export type TSignal = 'Offer' | 'Answer' | 'CreateRoom' | 'JoinRoom' | 'ResponseRoom' | 'Icecandidate' | 'ExitRoom';

export interface Signal {
  type: TSignal;
  roomId: string;
  data?: RTCSessionDescriptionInit;
}

export interface ResponseRoomSignal extends Signal {
  type: 'ResponseRoom';
  participants: string[];
}

export interface OfferSignal extends Signal {
  type: "Offer";
  sender: string;
  receiver: string;
}

export interface AnswerSignal extends Signal {
  type: 'Answer';
  sender: string;
  receiver: string;
}

export interface AnswerSignal extends Signal {
  type: 'Answer';
  sender: string;
  receiver: string;
}

export interface IcecandidateSignal extends Omit<Signal, 'data'> {
  type: 'Icecandidate';
  sender: string;
  receiver: string;
  data?: RTCIceCandidate;
}

export interface ExitRoomSignal extends Omit<Signal,'data'> {
  type: 'ExitRoom';
}