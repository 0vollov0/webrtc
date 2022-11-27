import { Signal } from "../types/signal";

export const isSignal = (object: any): object is Signal<any> => {
  return 'type' in object;
}