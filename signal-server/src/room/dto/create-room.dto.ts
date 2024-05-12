import { Length } from 'class-validator';

export class CreateRoomDto {
  @Length(2, 20)
  name: string;
}
