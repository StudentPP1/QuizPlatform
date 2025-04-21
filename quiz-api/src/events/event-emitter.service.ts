import { EventEmitter } from 'events';

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

import { ErrorOptions } from '@events/interfaces/error-options.interface';
import { SendMailOptions } from '@mail/interfaces/send-mail-options.interface';
import { MailService } from '@mail/mail.service';

@Injectable()
export class EventEmitterService
  extends EventEmitter
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly mailService: MailService) {
    super();
  }

  private handleError(error: ErrorOptions) {
    console.error(`[${error.context}] ${error.message}`);
    console.error(error.originalError);
  }

  private async handleUserRegistered(
    sendMailOptions: SendMailOptions,
  ): Promise<void> {
    try {
      await this.mailService.sendWelcomeEmail(sendMailOptions);
    } catch (err) {
      this.emit('error', {
        context: 'user.registered',
        message: `Failed to send welcome email to ${sendMailOptions.to}`,
        originalError: err,
      });
    }
  }

  onModuleInit() {
    this.on('user.registered', this.handleUserRegistered.bind(this));
    this.on('error', this.handleError.bind(this));
  }

  onModuleDestroy() {
    this.removeAllListeners('user.registered');
    this.removeAllListeners('error');
  }
}
