import { Length } from 'class-validator';

export class JoinRoomDto {
  @Length(2, 20)
  name: string;
}
