import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateGoogleUserDto } from './dto/create-google-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findUserByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async createUser<T extends CreateUserDto | CreateGoogleUserDto>(
    userDto: T,
    authProvider: 'local' | 'google',
  ): Promise<User> {
    const user = this.usersRepository.create({
      ...userDto,
      authProvider,
    });

    return this.usersRepository.save(user);
  }
}
