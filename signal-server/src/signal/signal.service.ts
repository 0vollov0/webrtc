import { Injectable } from '@nestjs/common';
import { OfferSignalDto } from './dto/offer-signal.dto';
import { Socket, Server } from 'socket.io';
import { AnswerSignalDto } from './dto/answer-signal.dto';
import { IceCandidateSignalDto } from './dto/icecandidate-signal.dto';

@Injectable()
export class SignalService {
  private server: Server;

  sendOffer(dto: OfferSignalDto, client: Socket) {
    return this.server
      .to(dto.room)
      .emit(`offer-signal-${dto.room}-${dto.receiver}`, {
        ...dto,
        sender: client.id,
      });
  }

  sendAnswer(dto: AnswerSignalDto, client: Socket) {
    return this.server
      .to(dto.room)
      .emit(`answer-signal-${dto.room}-${dto.receiver}`, {
        ...dto,
        sender: client.id,
      });
  }

  sendIceCandidate(dto: IceCandidateSignalDto, client: Socket) {
    return this.server
      .to(dto.room)
      .emit(`icecandidate-signal-${dto.room}-${dto.receiver}`, {
        ...dto,
        sender: client.id,
      });
  }

  setServer(server: Server) {
    this.server = server;
  }
}
