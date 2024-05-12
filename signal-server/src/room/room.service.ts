import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { ExitRoomDto } from './dto/exit-room.dto';

@Injectable()
export class RoomService {
  private rooms: Map<string, Set<string>>;

  constructor() {
    this.rooms = new Map<string, Set<string>>();
  }

  create({ name }: CreateRoomDto, clientId: string) {
    if (this.rooms.has(name)) return false;
    this.rooms.set(name, new Set(clientId));
    return true;
  }

  join({ name }: JoinRoomDto, clientId: string) {
    if (!this.rooms.has(name)) return false;
    if (this.rooms.get(name).has(clientId)) return false;
    this.rooms.get(name).add(clientId);
    return true;
  }

  exit({ name }: ExitRoomDto, clientId: string) {
    if (!this.rooms.has(name)) return false;
    return this.rooms.get(name).delete(clientId);
  }
}
