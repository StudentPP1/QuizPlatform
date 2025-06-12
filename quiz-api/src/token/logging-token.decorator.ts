import { ITokenService } from '@common/contracts/services/token.service.contract';
import { Tokens } from '@common/interfaces/tokens.payload';
import { baseLogger } from '@common/logging/logger';
import { RefreshToken } from '@database/entities/refresh-token.entity';
import { User } from '@database/entities/user.entity';

export class LoggingTokenDecorator implements ITokenService {
  private readonly logger = baseLogger.child({ service: 'Token Service' });

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
    return this.logMethod(this.generateTokens.name, [user], () =>
      this.wrapped.generateTokens(user),
    );
  }

  validateRefreshTokenInDb(
    tokenHash: string,
    userId: string,
  ): Promise<RefreshToken> {
    return this.logMethod(this.generateTokens.name, [tokenHash, userId], () =>
      this.wrapped.validateRefreshTokenInDb(tokenHash, userId),
    );
  }

  invalidateUserRefreshToken(userId: string): Promise<void> {
    return this.logMethod(this.invalidateUserRefreshToken.name, [userId], () =>
      this.wrapped.invalidateUserRefreshToken(userId),
    );
  }

  markTokenAsUsed(dbToken: RefreshToken): Promise<void> {
    return this.logMethod(this.markTokenAsUsed.name, [dbToken], () =>
      this.wrapped.markTokenAsUsed(dbToken),
    );
  }

  removeTokenGenerator(userId: string): void {
    this.logMethod(this.removeTokenGenerator.name, [userId], () => {
      this.wrapped.removeTokenGenerator(userId);
      return Promise.resolve();
    });
  }
}
