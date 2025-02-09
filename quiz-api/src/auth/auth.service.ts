import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { hash, compare } from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Payload } from './interfaces/payload.interface';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
import { TokenService } from '../token/token.service';
import { Tokens } from './interfaces/tokens.interface';
import { CreateGoogleUserDto } from 'src/users/dto/create-google-user.dto';

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

  private async createPayload(user: User): Promise<Payload> {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    return payload;
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
    const tokens = await this.tokenService.generateTokens(payload);

    return tokens;
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findUserByEmail(loginDto.email);

    if (!user)
      throw new NotFoundException('User with this email does not exists');

    if (!user.email || !user.password)
      throw new UnauthorizedException('Invalid email or password');

    const isPasswordValid = await compare(loginDto.password, user.password);

    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    const payload = await this.createPayload(user);
    const tokens = await this.tokenService.generateTokens(payload);

    return tokens;
  }

  async googleLogin(req: Request & { user: User }) {
    const googleUser = await this.validateGoogleUser(req.user);

    const payload = await this.createPayload(googleUser);
    const tokens = await this.tokenService.generateTokens(payload);

    return tokens;
  }

  async validateGoogleUser(createGoogleUserDto: CreateGoogleUserDto) {
    const user = await this.usersService.findUserByEmail(
      createGoogleUserDto.email,
    );
    if (user) return user;
    return await this.usersService.createGoogleUser(createGoogleUserDto);
  }

  async refreshTokens(refreshToken: string): Promise<Tokens> {
    try {
      const decoded = await this.tokenService.verifyRefreshToken(refreshToken);
      const payload = await this.createPayload(decoded);
      const tokens = await this.tokenService.generateTokens(payload);

      return tokens;
    } catch (error) {
      throw new ForbiddenException('Invalid refresh token');
    }
  }
}
