import { TOKEN_SERVICE } from '@common/constants/token.constants';
import { Controller, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { ITokenService } from '@common/contracts/services/token.service.contract';
import { RefreshTokenGuard } from '@common/guards/refresh-token.guard';
import { RequestWithUser } from '@common/interfaces/request-with-user.interface';

@Controller('token')
export class TokenController {
  constructor(
    @Inject(TOKEN_SERVICE) private readonly tokenService: ITokenService,
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
