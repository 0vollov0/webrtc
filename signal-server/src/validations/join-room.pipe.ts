import { PipeTransform, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { JoinRoomDto } from 'src/room/dto/join-room.dto';

@Injectable()
export class JoinRoomValidation implements PipeTransform {
  async transform(input: JoinRoomDto) {
    const instance = plainToInstance(JoinRoomDto, input);
    try {
      await validateOrReject(instance);
    } catch (errors) {
      throw new WsException(errors);
    }
    return input;
  }
}
