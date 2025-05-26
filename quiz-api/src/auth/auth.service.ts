import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

import { USERS_SERVICE } from '@common/constants/users.constants';
import { IUsersService } from '@common/contracts/services/users.service.contract';
import { CreateGoogleUserDto } from '@common/dto/create-google-user.dto';
import { CreateUserDto } from '@common/dto/create-user.dto';
import { AuthProvider } from '@common/enums/auth-provider.enum';
import { SendMailOptions } from '@common/interfaces/send-mail-options.interface';
import { Tokens } from '@common/interfaces/tokens.payload';
import { EventEmitterService } from '@events/event-emitter.service';
import { TokenService } from '@token/token.service';
import { User } from '@users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly emitter: EventEmitterService,
    @Inject(USERS_SERVICE) private readonly usersService: IUsersService,
    private readonly tokenService: TokenService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const hashedPassword = await hash(password, saltRound);

    return hashedPassword;
  }

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

    this.emitter.emit<SendMailOptions>('user.registered', {
      to: email,
      username,
    });

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

    delete user.password;

    return user;
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

    this.emitter.emit<SendMailOptions>('user.registered', {
      to: data.email,
      username: data.username,
    });

    return await this.usersService.createUser(data, AuthProvider.GOOGLE);
  }

  logout(userId: string): void {
    this.tokenService.removeTokenGenerator(userId);
  }
}
