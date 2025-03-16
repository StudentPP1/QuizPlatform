import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginCredentialsDTo } from './dto/login-credentials.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtGuard } from '../common/guards/auth.guard';

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

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    response.json({ accessToken });
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginCredentialsDTo: LoginCredentialsDTo,
    @Res() response: Response,
  ): Promise<void> {
    const { accessToken, refreshToken } =
      await this.authService.login(loginCredentialsDTo);

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    response.json({ accessToken });
  }

  @Get('logout')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async logout(@Res() response: Response) {
    response.clearCookie('refresh_token', {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
    });

    response.json({ message: 'Logged out successfully' });
  }
}
