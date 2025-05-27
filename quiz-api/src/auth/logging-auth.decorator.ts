import { IAuthService } from '@common/contracts/services/auth.service.contract';
import { CreateGoogleUserDto } from '@common/dto/create-google-user.dto';
import { CreateUserDto } from '@common/dto/create-user.dto';
import { Tokens } from '@common/interfaces/tokens.payload';
import { baseLogger } from '@common/logging/logger';
import { User } from '@users/entities/user.entity';

export class LoggingAuthDecorator implements IAuthService {
  private readonly logger = baseLogger.child({ service: 'Auth Service' });

  constructor(private readonly wrapped: IAuthService) {}

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

  signUp(createUserDto: CreateUserDto): Promise<Tokens> {
    return this.logMethod(
      'signUp',
      [createUserDto.username, createUserDto.email],
      () => this.wrapped.signUp(createUserDto),
    );
  }

  login(user: User): Promise<Tokens> {
    return this.logMethod('login', [user], () => this.wrapped.login(user));
  }

  googleLogin(user: User): Promise<Tokens> {
    return this.logMethod('googleLogin', [user], () =>
      this.wrapped.googleLogin(user),
    );
  }

  validateUser(email: string, password: string): Promise<User> {
    return this.logMethod('validateUser', [email], () =>
      this.wrapped.validateUser(email, password),
    );
  }

  validateGoogleUser(data: CreateGoogleUserDto): Promise<User> {
    return this.logMethod('validateGoogleUser', [data], () =>
      this.wrapped.validateGoogleUser(data),
    );
  }

  logout(userId: string): void {
    this.logMethod('logout', [userId], () => {
      this.wrapped.logout(userId);
      return Promise.resolve();
    });
  }
}
