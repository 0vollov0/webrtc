import { Length } from 'class-validator';

export class RequestRoomRoomInfoDto {
  @Length(2, 20)
  name: string;
}
