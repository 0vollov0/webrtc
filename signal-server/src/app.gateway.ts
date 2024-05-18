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
    console.log(process.env.SOCKET_PORT);
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
    console.log('handleDisconnect', client.id);
    this.clients.delete(client.id);
    client.disconnect(true);
  }

  @SubscribeMessage('create-room')
  @UseFilters(SocketExceptionFilter)
  handleCreateRoom(
    @MessageBody(CreateRoomValidation) dto: CreateRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(dto);
    if (!this.roomService.create(dto, client))
      throw new WsException('create room failed');
  }

  @SubscribeMessage('join-room')
  @UseFilters(SocketExceptionFilter)
  handleJoinRoom(
    @MessageBody(JoinRoomValidation) dto: JoinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    if (!this.roomService.join(dto, client))
      throw new WsException('create room failed');
  }

  @SubscribeMessage('exit-room')
  @UseFilters(SocketExceptionFilter)
  handleExitRoom(
    @MessageBody(ExitRoomValidation) dto: ExitRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    if (!this.roomService.exit(dto, client))
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
