import { PipeTransform, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AnswerSignalDto } from 'src/signal/dto/answer-signal.dto';

@Injectable()
export class AnswerSignalValidation implements PipeTransform {
  async transform(input: AnswerSignalDto) {
    const instance = plainToInstance(AnswerSignalDto, input);
    try {
      await validateOrReject(instance);
    } catch (errors) {
      throw new WsException(errors);
    }
    return input;
  }
}
