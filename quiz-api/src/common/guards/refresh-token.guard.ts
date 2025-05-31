import { createHash } from 'node:crypto';

import { TOKEN_SERVICE } from '@common/constants/token.constants';
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

import { ITokenService } from '@common/contracts/services/token.service.contract';
import { Payload } from '@common/interfaces/payload.interface';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const refreshToken = this.extractToken(request);
    const payload = await this.verifyToken(refreshToken);
    const tokenHash = this.hashToken(refreshToken);

    const dbToken = await this.tokenService.validateRefreshTokenInDb(
      tokenHash,
      payload.id,
    );

    await this.tokenService.markTokenAsUsed(dbToken);

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
}
