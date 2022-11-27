export type TSignal = 'Offer' | 'Answer' | 'CreateRoom' | 'JoinRoom';

export interface Signal<T> {
  type: TSignal;
  roomId: string;
  data?: T;
}