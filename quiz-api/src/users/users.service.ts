import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateGoogleUserDto } from '@users/dto/create-google-user.dto';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { User } from '@users/entities/user.entity';
import { AuthProvider } from '@users/enum/auth-provider.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ email });
  }

  async createUser<T extends CreateUserDto | CreateGoogleUserDto>(
    userDto: T,
    authProvider: AuthProvider,
  ): Promise<User> {
    const existingUser = await this.getUserByEmail(userDto.email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = this.usersRepository.create({
      ...userDto,
      authProvider,
    });

    return await this.usersRepository.save(user);
  }
}
