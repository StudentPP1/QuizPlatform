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

import { USERS_SERVICE } from '@common/constants/service.constants';
import { IUsersService } from '@common/contracts/services/users.service.contract';
import { Payload } from '@common/interfaces/payload.interface';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(USERS_SERVICE) private readonly usersService: IUsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    try {
      const decoded = await this.validateToken(token);
      const user = await this.validateUser(decoded);

      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  private extractToken(request: Request): string {
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Authorization header missing or malformed',
      );
    }

    return authHeader.split(' ')[1];
  }

  private async validateToken(token: string): Promise<Payload> {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  private async validateUser(payload: Payload) {
    const user = await this.usersService.getUserByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException('User not found or has been deleted');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }
}
