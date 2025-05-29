import { createHash } from 'node:crypto';

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import ms, { StringValue } from 'ms';

import { MemoizationCache } from '@common/cache/memoization-cache';
import { LFUStrategy } from '@common/cache/strategies/lfu.strategy';
import { REFRESH_TOKEN_REPOSITORY } from '@common/constants/token.constants';
import { IRefreshTokenRepository } from '@common/contracts/repositories/refresh-token.repository.contract';
import { ITokenService } from '@common/contracts/services/token.service.contract';
import { Payload } from '@common/interfaces/payload.interface';
import { Tokens } from '@common/interfaces/tokens.payload';
import { RefreshToken } from '@token/entities/refresh-token.entity';
import { User } from '@users/entities/user.entity';

@Injectable()
export class TokenService implements ITokenService {
  private cache = new MemoizationCache(new LFUStrategy(15));

  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokens(user: User): Promise<Tokens> {
    const generator = this.getTokenGenerator(user);

    const accessToken = (await generator.next()).value as string;
    const refreshToken = (await generator.next()).value as string;

    await this.saveRefreshToken(user, refreshToken);

    return { accessToken, refreshToken };
  }

  private getTokenGenerator(
    user: Partial<User>,
  ): AsyncGenerator<string, void, unknown> {
    const key = user.id;
    return this.cache.getOrCompute(key, () => this.createTokenGenerator(user));
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

  private createPayload(user: Partial<User>): Payload {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    return payload;
  }

  private async saveRefreshToken(user: User, token: string): Promise<void> {
    const hash = createHash('sha256').update(token).digest('hex');

    const expiresIn = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRATION',
    );

    const expiresAt = new Date(Date.now() + ms(expiresIn as StringValue));

    const refreshToken = this.refreshTokenRepository.create(
      user,
      hash,
      expiresAt,
    );

    await this.refreshTokenRepository.save(refreshToken);
  }

  async validateRefreshTokenInDb(
    tokenHash: string,
    userId: string,
  ): Promise<RefreshToken> {
    const dbToken = await this.refreshTokenRepository.findRefreshToken(
      userId,
      tokenHash,
    );

    if (!dbToken) {
      throw new UnauthorizedException(
        'Refresh token is no longer valid (expired or already used)',
      );
    }

    return dbToken;
  }

  async invalidateUserRefreshToken(userId: string): Promise<void> {
    const dbToken = await this.refreshTokenRepository.findRefreshToken(userId);

    if (!dbToken) {
      throw new UnauthorizedException('Refresh token expired or reused');
    }

    await this.markTokenAsUsed(dbToken);
  }

  async markTokenAsUsed(dbToken: RefreshToken): Promise<void> {
    dbToken.isUsed = true;
    await this.refreshTokenRepository.save(dbToken);
  }

  removeTokenGenerator(userId: string): void {
    this.cache.remove(userId);
  }
}
