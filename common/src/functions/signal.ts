import { Signal } from "../types/signal";

export const isSignal = (object: any): object is Signal => {
  return 'type' in object;
}