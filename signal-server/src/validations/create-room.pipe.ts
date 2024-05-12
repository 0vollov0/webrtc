import { PipeTransform, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateRoomDto } from 'src/room/dto/create-room.dto';

@Injectable()
export class CreateRoomValidation implements PipeTransform {
  async transform(input: CreateRoomDto) {
    const instance = plainToInstance(CreateRoomDto, input);
    try {
      await validateOrReject(instance);
    } catch (errors) {
      throw new WsException(errors);
    }
    return input;
  }
}
