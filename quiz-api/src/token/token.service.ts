import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { Payload } from './interfaces/payload.interface';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private createPayload(user: User): Payload {
    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
    };

    return payload;
  }

  async generateTokens(
    user: User,
    response: Response,
  ): Promise<{ accessToken: string }> {
    const payload = this.createPayload(user);

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION'),
      }),
    ]);

    this.setRefreshTokenCookie(response, refreshToken);

    return { accessToken };
  }

  private setRefreshTokenCookie(response: Response, refreshToken: string) {
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
