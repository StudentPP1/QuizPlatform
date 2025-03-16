import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare, hash } from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginCredentialsDTo } from './dto/login-credentials.dto';
import { TokenService } from '../token/token.service';
import { Tokens } from '../token/interfaces/tokens.payload';

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

  async signUp(createUserDto: CreateUserDto): Promise<Tokens> {
    const hashedPassword = await this.hashPassword(createUserDto.password);

    const user = await this.usersService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });

    const tokens = await this.tokenService.generateTokens(user);
    return tokens;
  }

  async login(loginCredentialsDTo: LoginCredentialsDTo): Promise<Tokens> {
    const { email, password } = loginCredentialsDTo;
    const user = await this.usersService.getUserByEmail(email);

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    const tokens = await this.tokenService.generateTokens(user);
    return tokens;
  }
}
