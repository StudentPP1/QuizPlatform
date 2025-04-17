import { Module } from '@nestjs/common';

import { EventEmitterService } from '@events/event-emitter.service';
import { MailModule } from '@mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [EventEmitterService],
  exports: [EventEmitterService],
})
export class EventEmitterModule {}
