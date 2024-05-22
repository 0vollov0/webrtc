import { Type } from 'class-transformer';
import {
  Equals,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

class Answer {
  @IsString()
  @IsOptional()
  sdp?: string;

  @Equals('answer')
  type: 'answer';
}

export class AnswerSignalDto {
  @Type(() => Answer)
  @ValidateNested()
  answer: Answer;

  @Length(2, 30)
  room: string;

  @IsString()
  receiver: string;
}
