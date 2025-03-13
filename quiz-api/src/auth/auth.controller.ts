import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginCredentialsDTo } from './dto/login-credentials.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ): Promise<void> {
    const accessToken = await this.authService.signUp(createUserDto, response);

    response.json(accessToken);
  }

  @Post('login')
  async login(
    @Body() loginCredentialsDTo: LoginCredentialsDTo,
    @Res() response: Response,
  ): Promise<void> {
    const accessToken = await this.authService.login(
      loginCredentialsDTo,
      response,
    );

    response.json(accessToken);
  }
}
