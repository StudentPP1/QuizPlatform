import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { TokenService } from '../token/token.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.create(createUserDto);

    this.tokenService.setRefreshTokenCookie(res, refreshToken);
    return res.json({ accessToken });
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginDto);

    this.tokenService.setRefreshTokenCookie(res, refreshToken);
    return res.json({ accessToken });
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) throw new ForbiddenException('Refresh token is missing');

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshTokens(refreshToken);

    this.tokenService.setRefreshTokenCookie(res, newRefreshToken);
    return res.json({ accessToken });
  }
}
