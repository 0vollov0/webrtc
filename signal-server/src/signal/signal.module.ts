import { Module } from '@nestjs/common';
import { SignalService } from './signal.service';

@Module({
  providers: [SignalService],
  exports: [SignalService],
})
export class SignalModule {}
