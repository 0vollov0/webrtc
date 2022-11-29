export type TSignal = 'Offer' | 'Answer' | 'CreateRoom' | 'JoinRoom' | 'ResponseRoom';

export interface Signal {
  type: TSignal;
  roomId: string;
  data?: RTCSessionDescriptionInit;
}

export interface SignalOffer extends Signal {
  type: "Offer";
  sender: string;
}

export interface SignalAnswer extends Signal {
  type: 'Answer';
  sender: string;
}