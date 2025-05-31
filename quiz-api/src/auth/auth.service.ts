import { TOKEN_SERVICE } from '@common/constants/token.constants';
import { USERS_SERVICE } from '@common/constants/users.constants';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

import { IAuthService } from '@common/contracts/services/auth.service.contract';
import { ITokenService } from '@common/contracts/services/token.service.contract';
import { IUsersService } from '@common/contracts/services/users.service.contract';
import { CreateGoogleUserDto } from '@common/dto/create-google-user.dto';
import { CreateUserDto } from '@common/dto/create-user.dto';
import { AuthProvider } from '@common/enums/auth-provider.enum';
import { eventEmitter } from '@common/events/event-emitter';
import { SendMailOptions } from '@common/interfaces/send-mail-options.interface';
import { Tokens } from '@common/interfaces/tokens.payload';
import { User } from '@database/entities/user.entity';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(USERS_SERVICE) private readonly usersService: IUsersService,
    @Inject(TOKEN_SERVICE) private readonly tokenService: ITokenService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<Tokens> {
    const { username, email, password } = createUserDto;
    const hashedPassword = await this.hashPassword(password);

    const user = await this.usersService.createUser(
      {
        ...createUserDto,
        password: hashedPassword,
      },
      AuthProvider.LOCAL,
    );

    eventEmitter.emit<SendMailOptions>('user.registered', {
      to: email,
      username,
    });

    return this.tokenService.generateTokens(user);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const hashedPassword = await hash(password, saltRound);

    return hashedPassword;
  }

  login(user: User): Promise<Tokens> {
    return this.tokenService.generateTokens(user);
  }

  googleLogin(user: User): Promise<Tokens> {
    return this.login(user);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.getUserByEmail(email);

    if (!user || !(await compare(password, user.password))) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async validateGoogleUser(data: CreateGoogleUserDto): Promise<User> {
    const user = await this.usersService.getUserByEmail(data.email);

    if (user) {
      return user;
    }

    eventEmitter.emit<SendMailOptions>('user.registered', {
      to: data.email,
      username: data.username,
    });

    return this.usersService.createUser(data, AuthProvider.GOOGLE);
  }

  async logout(userId: string): Promise<void> {
    this.tokenService.removeTokenGenerator(userId);
    await this.tokenService.invalidateUserRefreshToken(userId);
  }
}
