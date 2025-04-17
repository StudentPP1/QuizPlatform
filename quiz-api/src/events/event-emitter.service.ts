import { EventEmitter } from 'events';

import { Injectable, OnModuleInit } from '@nestjs/common';

import { SendMailOptions } from '@mail/interfaces/send-mail-options.interface';
import { MailService } from '@mail/mail.service';

@Injectable()
export class EventEmitterService extends EventEmitter implements OnModuleInit {
  constructor(private readonly mailService: MailService) {
    super();
  }

  onModuleInit() {
    this.on('user.registered', (sendMailOptions: SendMailOptions) => {
      void (async () => {
        try {
          await this.mailService.sendWelcomeEmail(sendMailOptions);
        } catch (err) {
          console.error(
            `Failed to send welcome email to ${sendMailOptions.to}`,
            err,
          );
        }
      })();
    });
  }
}
