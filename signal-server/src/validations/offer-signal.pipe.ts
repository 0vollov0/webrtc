import { PipeTransform, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { OfferSignalDto } from 'src/signal/dto/offer-signal.dto';

@Injectable()
export class OfferSignalValidation implements PipeTransform {
  async transform(input: OfferSignalDto) {
    const instance = plainToInstance(OfferSignalDto, input);
    try {
      await validateOrReject(instance);
    } catch (errors) {
      throw new WsException(errors);
    }
    return input;
  }
}
