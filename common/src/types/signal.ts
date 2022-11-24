export type TSignal = 'offer';

export interface Signal {
  type: TSignal;
  roomId: string;
  data: RTCSessionDescriptionInit;
}