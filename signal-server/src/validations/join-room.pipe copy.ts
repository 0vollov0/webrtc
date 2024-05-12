import { PipeTransform, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ExitRoomDto } from 'src/room/dto/exit-room.dto';

@Injectable()
export class ExitRoomValidation implements PipeTransform {
  async transform(input: ExitRoomDto) {
    const instance = plainToInstance(ExitRoomDto, input);
    try {
      await validateOrReject(instance);
    } catch (errors) {
      throw new WsException(errors);
    }
    return input;
  }
}
