import { IsString, Length } from 'class-validator';

export class IceCandidateSignalDto {
  iceCandidate: RTCIceCandidate;

  @Length(2, 30)
  room: string;

  @IsString()
  receiver: string;
}
