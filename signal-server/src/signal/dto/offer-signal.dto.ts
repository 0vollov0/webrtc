import { Type } from 'class-transformer';
import {
  Equals,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

class Offer {
  @IsString()
  @IsOptional()
  sdp?: string;

  @Equals('offer')
  type: 'offer';
}

export class OfferSignalDto {
  @Type(() => Offer)
  @ValidateNested()
  offer: Offer;

  @Length(2, 30)
  room: string;

  @IsString()
  receiver: string;
}
