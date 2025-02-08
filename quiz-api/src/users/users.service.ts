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

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.authProvider = 'local';

    return this.usersRepository.save(user);
  }

  async createGoogleUser(createGoogleUserDto: CreateGoogleUserDto) {
    const user = new User();
    user.username = createGoogleUserDto.username;
    user.email = createGoogleUserDto.email;
    user.googleId = createGoogleUserDto.googleId;
    user.authProvider = 'google';

    return this.usersRepository.save(user);
  }
}
