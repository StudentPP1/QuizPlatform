import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { MemoizationCache } from '@common/cache/memoization-cache';
import { LFUStrategy } from '@common/cache/strategies/lfu.strategy';
import { Payload } from '@common/interfaces/payload.interface';
import { Tokens } from '@common/interfaces/tokens.payload';
import { User } from '@users/entities/user.entity';

@Injectable()
export class TokenService {
  private cache = new MemoizationCache(new LFUStrategy(15));

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private createPayload(user: Partial<User>): Payload {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    return payload;
  }

  private async *createTokenGenerator(
    user: Partial<User>,
  ): AsyncGenerator<string, void, unknown> {
    const payload = this.createPayload(user);

    while (true) {
      yield await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION'),
      });

      yield await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION'),
      });

      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  async generateTokens(user: User): Promise<Tokens> {
    const generator = this.getTokenGenerator(user);
    return {
      accessToken: (await generator.next()).value as string,
      refreshToken: (await generator.next()).value as string,
    };
  }

  private getTokenGenerator(
    user: Partial<User>,
  ): AsyncGenerator<string, void, unknown> {
    const key = user.id;
    return this.cache.getOrCompute(key, () => this.createTokenGenerator(user));
  }

  removeTokenGenerator(userId: string): void {
    this.cache.remove(userId);
  }
}
