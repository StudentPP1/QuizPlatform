import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenStrategy } from '../../token/strategies/refresh-token.strategy';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly refreshTokenStrategy: RefreshTokenStrategy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies?.['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      request.decoded = await this.refreshTokenStrategy.validate(refreshToken);
      return true;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
