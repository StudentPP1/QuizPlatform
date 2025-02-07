import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './interfaces/tokens.interface';
import { Payload } from './interfaces/payload.interface';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(password, saltRound);

    return hashedPassword;
  }

  private async createPayload(user: User): Promise<Payload> {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    return payload;
  }

  private async generateTokens(payload: Payload): Promise<Tokens> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async create(createUserDto: CreateUserDto) {
    const isUserExist = await this.usersService.findUserByEmail(
      createUserDto.email,
    );

    if (isUserExist)
      throw new ConflictException('User with this email already exists');

    const hashedPassword = await this.hashPassword(createUserDto.password);

    const user = await this.usersService.createUser({
      email: createUserDto.email,
      username: createUserDto.username,
      password: hashedPassword,
    });

    const payload = await this.createPayload(user);
    const tokens = await this.generateTokens(payload);

    return tokens;
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findUserByEmail(loginDto.email);

    if (!user)
      throw new NotFoundException('User with this email does not exists');

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    const payload = await this.createPayload(user);
    const tokens = await this.generateTokens(payload);

    return tokens;
  }
}
