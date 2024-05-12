import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { RoomModule } from './room/room.module';
import { SignalModule } from './signal/signal.module';

@Module({
  imports: [RoomModule, SignalModule],
  providers: [AppService, AppGateway],
})
export class AppModule {}
