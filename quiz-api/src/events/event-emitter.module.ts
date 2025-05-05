import { Global, Module } from '@nestjs/common';

import { EventEmitterService } from '@events/event-emitter.service';
import { MailModule } from '@mail/mail.module';
import { UsersModule } from '@users/users.module';

@Global()
@Module({
  imports: [MailModule, UsersModule],
  providers: [EventEmitterService],
  exports: [EventEmitterService],
})
export class EventEmitterModule {}
