import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare, hash } from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { TokenService } from '../token/token.service';
import { Tokens } from '../token/interfaces/tokens.payload';
import { CreateGoogleUserDto } from '../users/dto/create-google-user.dto';
import { User } from '../users/entities/user.entity';

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

    const user = await this.usersService.createUser(
      {
        ...createUserDto,
        password: hashedPassword,
      },
      'local',
    );

    const generator: AsyncGenerator<string, void, unknown> =
      this.tokenService.generateTokens(user);

    const tokens: Tokens = {
      accessToken: (await generator.next()).value as string,
      refreshToken: (await generator.next()).value as string,
    };

    return tokens;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.getUserByEmail(email);

    if (!user || !(await compare(password, user.password))) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: User): Promise<Tokens> {
    const generator: AsyncGenerator<string, void, unknown> =
      this.tokenService.generateTokens(user);

    const tokens: Tokens = {
      accessToken: (await generator.next()).value as string,
      refreshToken: (await generator.next()).value as string,
    };

    return tokens;
  }

  async googleLogin(data: User) {
    const generator = this.tokenService.generateTokens(data);

    await generator.next();
    const refreshToken = (await generator.next()).value as string;

    return refreshToken;
  }

  async validateGoogleUser(data: CreateGoogleUserDto) {
    const user = await this.usersService.getUserByEmail(data.email);

    if (user) {
      return user;
    }

    return await this.usersService.createUser(data, 'google');
  }
}
