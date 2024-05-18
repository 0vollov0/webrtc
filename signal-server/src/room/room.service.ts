import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { ExitRoomDto } from './dto/exit-room.dto';
import { Socket } from 'socket.io';

@Injectable()
export class RoomService {
  private rooms: Map<string, Set<string>>;

  constructor() {
    this.rooms = new Map<string, Set<string>>();
  }

  create({ name }: CreateRoomDto, client: Socket) {
    if (this.rooms.has(name)) return false;
    this.rooms.set(name, new Set(client.id));
    return client.emit('create-room', name);
  }

  join({ name }: JoinRoomDto, client: Socket) {
    if (!this.rooms.has(name)) return false;
    if (this.rooms.get(name).has(client.id)) return false;
    this.rooms.get(name).add(client.id);
    return client.emit('join-room', name);
  }

  exit({ name }: ExitRoomDto, client: Socket) {
    if (!this.rooms.has(name)) return false;
    this.rooms.get(name).delete(client.id);
    return client.emit('exit-room', name);
  }
}
