import { ITokenService } from '@common/contracts/services/token.service.contract';
import { Tokens } from '@common/interfaces/tokens.payload';
import { baseLogger } from '@common/logging/logger';
import { User } from '@users/entities/user.entity';

export class LoggingTokenDecorator implements ITokenService {
  private readonly logger = baseLogger.child({ service: 'Task Service' });

  constructor(private readonly wrapped: ITokenService) {}

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

  generateTokens(user: User): Promise<Tokens> {
    return this.logMethod('generateTokens', [user], () =>
      this.wrapped.generateTokens(user),
    );
  }

  removeTokenGenerator(userId: string): void {
    this.logMethod('removeTokenGenerator', [userId], () => {
      this.wrapped.removeTokenGenerator(userId);
      return Promise.resolve();
    });
  }
}
