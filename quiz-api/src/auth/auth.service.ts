import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(password, saltRound);

    return hashedPassword;
  }

  private async createPayload(user: User) {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    return payload;
  }

  private async generateTokens(payload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
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
}
