import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare, hash } from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginCredentialsDTo } from './dto/login-credentials.dto';
import { TokenService } from '../token/token.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const hashedPassword = await hash(password, saltRound);

    return hashedPassword;
  }

  async signUp(
    createUserDto: CreateUserDto,
    response: Response,
  ): Promise<{ accessToken: string }> {
    const hashedPassword = await this.hashPassword(createUserDto.password);

    const user = await this.usersService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });

    const accessToken = await this.tokenService.generateTokens(user, response);
    return accessToken;
  }

  async login(
    loginCredentialsDTo: LoginCredentialsDTo,
    response: Response,
  ): Promise<{ accessToken: string }> {
    const { email, password } = loginCredentialsDTo;
    const user = await this.usersService.getUserByEmail(email);

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    const accessToken = await this.tokenService.generateTokens(user, response);
    return accessToken;
  }
}
