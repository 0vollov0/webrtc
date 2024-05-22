import { PipeTransform, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { IceCandidateSignalDto } from 'src/signal/dto/icecandidate-signal.dto';

@Injectable()
export class IceCandidateSignalValidation implements PipeTransform {
  async transform(input: IceCandidateSignalDto) {
    const instance = plainToInstance(IceCandidateSignalDto, input);
    try {
      await validateOrReject(instance);
    } catch (errors) {
      throw new WsException(errors);
    }
    return input;
  }
}
