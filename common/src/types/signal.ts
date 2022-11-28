export type TSignal = 'Offer' | 'Answer' | 'CreateRoom' | 'JoinRoom';

export interface Signal {
  type: TSignal;
  roomId: string;
  data?: RTCSessionDescriptionInit;
}

export interface SignalOffer extends Signal {
  type: "Offer";
}

export interface SignalAnswer extends Signal {
  type: 'Answer';
  sender: string;
}