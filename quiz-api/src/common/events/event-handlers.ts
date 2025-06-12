import { IMailService } from '@common/contracts/services/mail.service.contract';
import { IUsersService } from '@common/contracts/services/users.service.contract';
import { eventEmitter } from '@common/events/event-emitter';
import { EVENTS } from '@common/events/event.enum';
import { ErrorOptions } from '@common/interfaces/error-options.interface';
import { SendMailOptions } from '@common/interfaces/send-mail-options.interface';
import { UpdateAuthorRatingOptions } from '@common/interfaces/update-author-rating-options.interface';
import { baseLogger } from '@common/logging/logger';

const logger = baseLogger.child({ service: 'EventEmitter' });

export const registerEventListeners = (
  mailService: IMailService,
  usersService: IUsersService,
): void => {
  const handleUserRegistered = async (
    options: SendMailOptions,
  ): Promise<void> => {
    logger.info(`Event triggered: user.registered`, {
      email: options.to,
      username: options.username,
    });

    try {
      await mailService.sendWelcomeEmail(options);
    } catch (error) {
      eventEmitter.emit(EVENTS.ERROR, {
        context: 'user.registered',
        message: `Failed to send welcome email to ${options.to}`,
        originalError: error as Error,
      });
    }
  };

  const handleUserRatingUpdated = async (
    options: UpdateAuthorRatingOptions,
  ): Promise<void> => {
    logger.info(`Event triggered: user.rating_updated`, {
      userId: options.userId,
      newRating: options.newRating,
    });

    try {
      await usersService.updateAuthorRating(options);
    } catch (error) {
      eventEmitter.emit(EVENTS.ERROR, {
        context: 'user.rating_updated',
        message: `Failed to update rating for user ${options.userId}`,
        originalError: error as Error,
      });
    }
  };

  eventEmitter.on(EVENTS.USER_REGISTERED, (options: SendMailOptions) => {
    void handleUserRegistered(options);
  });

  eventEmitter.on(
    EVENTS.USER_RATING_UPDATED,
    (options: UpdateAuthorRatingOptions) => {
      void handleUserRatingUpdated(options);
    },
  );

  eventEmitter.on(EVENTS.ERROR, (error: ErrorOptions): void => {
    logger.error(
      `Event triggered: an error occurred in ${error.context}: ${error.message}`,
      {
        stack: error.originalError?.stack,
      },
    );
  });
};

export const removeEventListeners = (): void => {
  eventEmitter.removeAllListeners(EVENTS.USER_REGISTERED);
  eventEmitter.removeAllListeners(EVENTS.USER_RATING_UPDATED);
  eventEmitter.removeAllListeners(EVENTS.ERROR);
};
