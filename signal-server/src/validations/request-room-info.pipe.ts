import { PipeTransform, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RequestRoomRoomInfoDto } from 'src/room/dto/request-room-info.dto';

@Injectable()
export class RequestRoomInfoValidation implements PipeTransform {
  async transform(input: RequestRoomRoomInfoDto) {
    const instance = plainToInstance(RequestRoomRoomInfoDto, input);
    try {
      await validateOrReject(instance);
    } catch (errors) {
      throw new WsException(errors);
    }
    return input;
  }
}
