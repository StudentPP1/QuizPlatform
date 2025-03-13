import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare, hash } from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { LoginCredentialsDTo } from './dto/login-credentials.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const hashedPassword = await hash(password, saltRound);

    return hashedPassword;
  }

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashPassword(createUserDto.password);

    const user = await this.usersService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });

    return user;
  }

  async login(loginCredentialsDTo: LoginCredentialsDTo): Promise<User> {
    const { email, password } = loginCredentialsDTo;
    const user = await this.usersService.getUserByEmail(email);

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    return user;
  }
}
