import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

import { RefreshTokenGuard } from '@common/guards/refresh-token.guard';
import { Payload } from '@token/interfaces/payload.interface';
import { TokenService } from '@token/token.service';

@Controller('token')
export class TokenController {
  constructor(
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

  @Post('update')
  @UseGuards(RefreshTokenGuard)
  async updateTokens(
    @Req() request: Request & { decoded?: Payload },
    @Res() response: Response,
  ) {
    const generator = this.tokenService.getTokenGenerator(request.decoded);

    const accessToken = (await generator.next()).value;
    const refreshToken = (await generator.next()).value;

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    response.json({ accessToken });
  }
}
