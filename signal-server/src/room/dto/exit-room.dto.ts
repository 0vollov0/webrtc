import { Length } from 'class-validator';

export class ExitRoomDto {
  @Length(2, 20)
  name: string;
}
