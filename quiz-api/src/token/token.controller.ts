import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { TokenService } from './token.service';
import { RefreshTokenGuard } from '../common/guards/refresh-token.guard';
import { ConfigService } from '@nestjs/config';
import { Payload } from './interfaces/payload.interface';

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
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(request.decoded);

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    response.json({ accessToken });
  }
}
