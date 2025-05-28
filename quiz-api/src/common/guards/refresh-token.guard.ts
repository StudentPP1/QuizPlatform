import { createHash } from 'node:crypto';

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { REFRESH_TOKEN_REPOSITORY } from '@common/constants/token.constants';
import { IRefreshTokenRepository } from '@common/contracts/repositories/refresh-token.repository.contract';
import { Payload } from '@common/interfaces/payload.interface';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const refreshToken = this.extractToken(request);
    const payload = await this.verifyToken(refreshToken);
    const tokenHash = this.hashToken(refreshToken);

    await this.validateTokenInDb(tokenHash, payload.id);

    request.user = payload;
    return true;
  }

  private extractToken(request: Request): string {
    const token = request.cookies?.['refresh_token'] as string;

    if (!token) {
      throw new UnauthorizedException('Refresh token not found');
    }

    return token;
  }

  private async verifyToken(token: string): Promise<Payload> {
    try {
      return this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private async validateTokenInDb(
    tokenHash: string,
    userId: string,
  ): Promise<void> {
    const dbToken = await this.refreshTokenRepository.findByOneByUserIdAndHash(
      tokenHash,
      userId,
    );

    if (!dbToken) {
      throw new UnauthorizedException('Refresh token expired or reused');
    }

    dbToken.isUsed = true;
    await this.refreshTokenRepository.save(dbToken);
  }
}
