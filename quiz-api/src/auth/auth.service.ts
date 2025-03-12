import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { hash } from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';

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
}
