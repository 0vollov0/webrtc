export type TSignal = 'offer';

export interface Signal {
  type: TSignal;
  data: RTCSessionDescriptionInit;
}