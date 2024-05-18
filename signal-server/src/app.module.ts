import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { RoomModule } from './room/room.module';
import { SignalModule } from './signal/signal.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    RoomModule,
    SignalModule,
  ],
  providers: [AppService, AppGateway],
})
export class AppModule {}
