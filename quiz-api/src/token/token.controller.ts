import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { RefreshTokenGuard } from '@common/guards/refresh-token.guard';
import { RequestWithUser } from '@common/interfaces/request-with-user.interface';
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
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ): Promise<void> {
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(request.user);

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    response.json({ accessToken });
  }
}
