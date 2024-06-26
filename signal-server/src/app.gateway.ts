import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room/room.service';
import { SignalService } from './signal/signal.service';
import { CreateRoomValidation } from './validations/create-room.pipe';
import { CreateRoomDto } from './room/dto/create-room.dto';
import { JoinRoomValidation } from './validations/join-room.pipe';
import { ExitRoomValidation } from './validations/join-room.pipe copy';
import { ExitRoomDto } from './room/dto/exit-room.dto';
import { JoinRoomDto } from './room/dto/join-room.dto';
import { UseFilters } from '@nestjs/common';
import { SocketExceptionFilter } from './filters/socket-exception.filter';
import { SOCKET_ERROR_CODE } from './tpye';
import { OfferSignalDto } from './signal/dto/offer-signal.dto';
import { OfferSignalValidation } from './validations/offer-signal.pipe';
import { AnswerSignalDto } from './signal/dto/answer-signal.dto';
import { AnswerSignalValidation } from './validations/answer-signal.pipe';
import { IceCandidateSignalDto } from './signal/dto/icecandidate-signal.dto';
import { RequestRoomRoomInfoDto } from './room/dto/request-room-info.dto';
import { RequestRoomInfoValidation } from './validations/request-room-info.pipe';
import { IceCandidateSignalValidation } from './validations/icecandidate-signal.pipe';

@WebSocketGateway(+process.env.SOCKET_PORT || 8081, {
  cors: {
    origin: '*',
    methods: ['GET'],
    credentials: true,
  },
})
export class AppGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private clients: Map<string, Socket>;

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly roomService: RoomService,
    private readonly signalService: SignalService,
  ) {
    this.clients = new Map<string, Socket>();
  }
  afterInit(server: Server) {
    this.signalService.setServer(server);
  }

  handleConnection(client: Socket) {
    console.log('handleConnection', client.id);
    if (this.clients.has(client.id)) client.disconnect(true);
    else {
      this.clients.set(client.id, client);
      client.emit('client_id', client.id);
    }
  }

  handleDisconnect(client: Socket) {
    this.roomService.disconnect(client);
    this.clients.delete(client.id);
    client.disconnect(true);
  }

  @SubscribeMessage('room-info')
  @UseFilters(SocketExceptionFilter)
  handleRoomInfo(
    @MessageBody(RequestRoomInfoValidation) dto: RequestRoomRoomInfoDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.roomService.sendRoomInfo(dto, client);
  }

  @SubscribeMessage('create-room')
  @UseFilters(SocketExceptionFilter)
  handleCreateRoom(
    @MessageBody(CreateRoomValidation) dto: CreateRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    if (!this.roomService.create(dto, client))
      throw new WsException({
        code: SOCKET_ERROR_CODE.CREATE_ROOM,
        message: 'create room failed',
      });
  }

  @SubscribeMessage('join-room')
  @UseFilters(SocketExceptionFilter)
  handleJoinRoom(
    @MessageBody(JoinRoomValidation) dto: JoinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    if (!this.roomService.join(dto, client))
      throw new WsException({
        code: SOCKET_ERROR_CODE.JOIN_ROOM,
        message: 'join room failed',
      });
  }

  @SubscribeMessage('exit-room')
  @UseFilters(SocketExceptionFilter)
  handleExitRoom(
    @MessageBody(ExitRoomValidation) dto: ExitRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    if (!this.roomService.exit(dto, client))
      throw new WsException({
        code: SOCKET_ERROR_CODE.JOIN_ROOM,
        message: 'exit room failed',
      });
  }

  @SubscribeMessage('offer-signal')
  @UseFilters(SocketExceptionFilter)
  handleOfferSignal(
    @MessageBody(OfferSignalValidation) dto: OfferSignalDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.signalService.sendOffer(dto, client);
  }

  @SubscribeMessage('answer-signal')
  @UseFilters(SocketExceptionFilter)
  handleAnswerSignal(
    @MessageBody(AnswerSignalValidation) dto: AnswerSignalDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.signalService.sendAnswer(dto, client);
  }

  @SubscribeMessage('icecandidate-signal')
  @UseFilters(SocketExceptionFilter)
  handleIcecandidateSignal(
    @MessageBody(IceCandidateSignalValidation) dto: IceCandidateSignalDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.signalService.sendIceCandidate(dto, client);
  }
}
