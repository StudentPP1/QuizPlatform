import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies['refreshToken'];

    if (!refreshToken) {
      throw new ForbiddenException('Refresh token is missing');
    }

    const isValid = await this.authService.validateRefreshToken(refreshToken);
    return isValid;
  }
}
