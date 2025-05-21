import { EventEmitter } from 'events';

import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
} from '@nestjs/common';

import { USERS_SERVICE } from '@common/constants/user.token';
import { ErrorOptions } from '@events/interfaces/error-options.interface';
import { UpdateAuthorRatingOptions } from '@events/interfaces/update-author-rating-options.interface';
import { SendMailOptions } from '@mail/interfaces/send-mail-options.interface';
import { MailService } from '@mail/mail.service';
import { IUsersService } from '@users/users-service.interface';

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

  private handleError(error: ErrorOptions) {
    console.error(`[${error.context}] ${error.message}`);
    console.error(error.originalError);
  }

  private async handleUserRegistered(options: SendMailOptions): Promise<void> {
    try {
      await this.mailService.sendWelcomeEmail(options);
    } catch (err) {
      this.emit('error', {
        context: 'user.registered',
        message: `Failed to send welcome email to ${options.to}`,
        originalError: err,
      });
    }
  }

  private async handleUserRatingUpdated(
    options: UpdateAuthorRatingOptions,
  ): Promise<void> {
    try {
      await this.usersService.updateAuthorRating(options);
    } catch (err) {
      this.emit('error', {
        context: 'user.rating_updated',
        message: `Failed to update rating for user ${options.userId}`,
        originalError: err,
      });
    }
  }

  onModuleInit() {
    this.on('user.registered', this.handleUserRegistered.bind(this));
    this.on('user.rating_updated', this.handleUserRatingUpdated.bind(this));
    this.on('error', this.handleError.bind(this));
  }

  onModuleDestroy() {
    this.removeAllListeners('user.registered');
    this.removeAllListeners('user.rating_updated');
    this.removeAllListeners('error');
  }
}
