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
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

import { AuthService } from '@auth/auth.service';
import { CreateUserDto } from '@common/dto/create-user.dto';
import { GoogleOAuthGuard } from '@common/guards/google-oauth.guard';
import { JwtGuard } from '@common/guards/jwt.guard';
import { LocalAuthGuard } from '@common/guards/local-auth.guard';
import { User } from '@users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
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
    @Req() request: Request & { user?: User },
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
  googleAuth() {
    return;
  }

  @Get('google/redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(
    @Req() request: Request & { user?: User },
    @Res() response: Response,
  ) {
    if (!request.user) {
      throw new UnauthorizedException('Google authentication failed');
    }
    const refreshToken = await this.authService.googleLogin(request.user);

    this.setRefreshTokenCookie(response, refreshToken);

    response.redirect(`${this.configService.get<string>('CLIENT_URL')}/home`);
  }

  @Get('logout')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  logout(@Req() request: Request & { user?: User }, @Res() response: Response) {
    this.authService.logout(request.user.id);

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
