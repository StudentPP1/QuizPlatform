import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

import { Tokens } from '@token/interfaces/tokens.payload';
import { TokenService } from '@token/token.service';
import { CreateGoogleUserDto } from '@users/dto/create-google-user.dto';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { User } from '@users/entities/user.entity';
import { AuthProvider } from '@users/enum/auth-provider.enum';
import { UsersService } from '@users/users.service';

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
      AuthProvider.LOCAL,
    );

    const generator = this.tokenService.getTokenGenerator(user);

    return {
      accessToken: (await generator.next()).value as string,
      refreshToken: (await generator.next()).value as string,
    };
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
    const generator = this.tokenService.getTokenGenerator(user);

    return {
      accessToken: (await generator.next()).value as string,
      refreshToken: (await generator.next()).value as string,
    };
  }

  async googleLogin(user: User) {
    const generator = this.tokenService.getTokenGenerator(user);

    await generator.next();

    return (await generator.next()).value as string;
  }

  async validateGoogleUser(data: CreateGoogleUserDto) {
    const user = await this.usersService.getUserByEmail(data.email);

    if (user) {
      return user;
    }

    return await this.usersService.createUser(data, AuthProvider.GOOGLE);
  }

  async logout(userId: string) {
    this.tokenService.removeTokenGenerator(userId);
  }
}
