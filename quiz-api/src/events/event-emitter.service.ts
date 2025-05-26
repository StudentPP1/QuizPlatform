import { EventEmitter } from 'events';

import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
} from '@nestjs/common';

import { USERS_SERVICE } from '@common/constants/users.constants';
import { IUsersService } from '@common/contracts/services/users.service.contract';
import { ErrorOptions } from '@common/interfaces/error-options.interface';
import { SendMailOptions } from '@common/interfaces/send-mail-options.interface';
import { UpdateAuthorRatingOptions } from '@common/interfaces/update-author-rating-options.interface';
import { MailService } from '@mail/mail.service';

@Injectable()
export class EventEmitterService
  extends EventEmitter
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    private readonly mailService: MailService,
    @Inject(USERS_SERVICE) private readonly usersService: IUsersService,
  ) {
    super();
  }

  private handleError(error: ErrorOptions): void {
    console.error(`[${error.context}] ${error.message}`);
    console.error(error.originalError);
  }

  private async handleUserRegistered(options: SendMailOptions): Promise<void> {
    try {
      await this.mailService.sendWelcomeEmail(options);
    } catch (error) {
      this.emit('error', {
        context: 'user.registered',
        message: `Failed to send welcome email to ${options.to}`,
        originalError: error as Error,
      });
    }
  }

  private async handleUserRatingUpdated(
    options: UpdateAuthorRatingOptions,
  ): Promise<void> {
    try {
      await this.usersService.updateAuthorRating(options);
    } catch (error) {
      this.emit('error', {
        context: 'user.rating_updated',
        message: `Failed to update rating for user ${options.userId}`,
        originalError: error as Error,
      });
    }
  }

  onModuleInit() {
    this.on(
      'user.registered',
      this.handleUserRegistered.bind(this) as (...args: any[]) => void,
    );
    this.on(
      'user.rating_updated',
      this.handleUserRatingUpdated.bind(this) as (...args: any[]) => void,
    );
    this.on('error', this.handleError.bind(this) as (...args: any[]) => void);
  }

  onModuleDestroy() {
    this.removeAllListeners('user.registered');
    this.removeAllListeners('user.rating_updated');
    this.removeAllListeners('error');
  }
}
