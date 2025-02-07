import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private async isEmailUnique(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return !user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const isEmailUnique = await this.isEmailUnique(createUserDto.email);

    if (!isEmailUnique)
      throw new ConflictException('User with this email already exists');

    const user = new User();
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.password = createUserDto.password;

    return this.usersRepository.save(user);
  }
}
