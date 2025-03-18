import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { Payload } from './interfaces/payload.interface';
import { ConfigService } from '@nestjs/config';
import { Tokens } from './interfaces/tokens.payload';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private createPayload(user: Partial<User>): Payload {
    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
    };

    return payload;
  }

  async generateTokens(user: Partial<User>): Promise<Tokens> {
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

    return { accessToken, refreshToken };
  }
}
