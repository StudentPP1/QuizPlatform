import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { AUTH_SERVICE } from '@common/constants/service.constants';
import { IAuthService } from '@common/contracts/services/auth.service.contract';
import { CreateUserDto } from '@common/dto/create-user.dto';
import { GoogleOAuthGuard } from '@common/guards/google-oauth.guard';
import { JwtGuard } from '@common/guards/jwt.guard';
import { LocalAuthGuard } from '@common/guards/local-auth.guard';
import { RequestWithUser } from '@common/interfaces/request-with-user.interface';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: IAuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('signup')
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ): Promise<void> {
    const { accessToken, refreshToken } =
      await this.authService.signUp(createUserDto);

    this.setRefreshTokenCookie(response, refreshToken);

    response.json({ accessToken });
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ): Promise<void> {
    const { accessToken, refreshToken } = await this.authService.login(
      request.user,
    );

    this.setRefreshTokenCookie(response, refreshToken);

    response.json({ accessToken });
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  googleAuth(): void {
    return;
  }

  @Get('google/redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ): Promise<void> {
    if (!request.user) {
      throw new UnauthorizedException('Google authentication failed');
    }
    const { refreshToken } = await this.authService.googleLogin(request.user);

    this.setRefreshTokenCookie(response, refreshToken);

    response.redirect(`${this.configService.get<string>('CLIENT_URL')}/home`);
  }

  @Get('logout')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async logout(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ): Promise<void> {
    await this.authService.logout(request.user.id);

    response.clearCookie('refresh_token', {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
    });

    response.json({ message: 'Logged out successfully' });
  }

  private setRefreshTokenCookie(
    response: Response,
    refreshToken: string,
  ): void {
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
