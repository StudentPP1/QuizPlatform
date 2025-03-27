import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Payload } from '@token/interfaces/payload.interface';
import { User } from '@users/entities/user.entity';

@Injectable()
export class TokenService {
  private tokenGenerators = new Map<
    string,
    AsyncGenerator<string, void, unknown>
  >();

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

  async *createTokenGenerator(
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

      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  getTokenGenerator(
    user: Partial<User>,
  ): AsyncGenerator<string, void, unknown> {
    if (!this.tokenGenerators.has(user.id)) {
      this.tokenGenerators.set(user.id, this.createTokenGenerator(user));
    }

    return this.tokenGenerators.get(user.id);
  }

  removeTokenGenerator(userId: string) {
    this.tokenGenerators.delete(userId);
  }
}
