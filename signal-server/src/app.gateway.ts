import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
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

@WebSocketGateway(+process.env.SOCKET_PORT)
export class AppGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private clients: Map<string, Socket>;

  constructor(
    private readonly roomService: RoomService,
    private readonly signalService: SignalService,
  ) {
    this.clients = new Map<string, Socket>();
  }
  afterInit(server: Server) {}

  handleConnection(client: Socket) {
    if (!this.clients.has(client.id)) client.disconnect(true);
    else {
      this.clients.set(client.id, client);
    }
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client.id);
    client.disconnect(true);
  }

  @SubscribeMessage('create-room')
  @UseFilters(SocketExceptionFilter)
  handleCreateRoom(
    @MessageBody(CreateRoomValidation) dto: CreateRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    if (!this.roomService.create(dto, client.id))
      throw new WsException('create room failed');
  }

  @SubscribeMessage('join-room')
  @UseFilters(SocketExceptionFilter)
  handleJoinRoom(
    @MessageBody(JoinRoomValidation) dto: JoinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    if (!this.roomService.join(dto, client.id))
      throw new WsException('create room failed');
  }

  @SubscribeMessage('exit-room')
  @UseFilters(SocketExceptionFilter)
  handleExitRoom(
    @MessageBody(ExitRoomValidation) dto: ExitRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    if (!this.roomService.exit(dto, client.id))
      throw new WsException('create room failed');
  }

  @SubscribeMessage('offer-signal')
  @UseFilters(SocketExceptionFilter)
  handleOfferSignal() {
    return null;
  }

  @SubscribeMessage('answer-signal')
  @UseFilters(SocketExceptionFilter)
  handleAnswerSignal() {
    return null;
  }

  @SubscribeMessage('icecandidate-signal')
  @UseFilters(SocketExceptionFilter)
  handleIcecandidateSignal() {
    return null;
  }
}
