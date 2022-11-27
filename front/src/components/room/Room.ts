export type THandleRoomId = (id: string) => void;

export interface RoomProps {
  handleRoomId: THandleRoomId;
}
