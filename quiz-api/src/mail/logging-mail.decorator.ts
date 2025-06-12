import { IMailService } from '@common/contracts/services/mail.service.contract';
import { SendMailOptions } from '@common/interfaces/send-mail-options.interface';
import { baseLogger } from '@common/logging/logger';

export class LoggingMailDecorator implements IMailService {
  private readonly logger = baseLogger.child({ service: 'Mail Service' });

  constructor(private readonly wrapped: IMailService) {}

  private async logMethod<T>(
    methodName: string,
    args: unknown[],
    fn: () => Promise<T>,
  ): Promise<T> {
    this.logger.info(
      `Called ${methodName}(${args.map((arg) => JSON.stringify(arg)).join(', ')})`,
    );
    const start = Date.now();

    try {
      const result = await fn();
      const duration = Date.now() - start;
      this.logger.info(`Method ${methodName} completed in ${duration}ms`);
      return result;
    } catch (error) {
      this.logger.error(
        `Method ${methodName} failed: ${error instanceof Error ? error.message : error}`,
      );
      throw error;
    }
  }

  sendWelcomeEmail(options: SendMailOptions): Promise<void> {
    return this.logMethod(this.sendWelcomeEmail.name, [options], () =>
      this.wrapped.sendWelcomeEmail(options),
    );
  }
}
