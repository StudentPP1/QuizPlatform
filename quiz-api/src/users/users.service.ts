import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QuizPreviewDto } from '@quiz/dto/quiz-preview.dto';
import { CreateGoogleUserDto } from '@users/dto/create-google-user.dto';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { UserInfoDto } from '@users/dto/user-info.dto';
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

  async getUserInfo(
    userId: string,
    idFromRequest: string,
  ): Promise<UserInfoDto> {
    const userIdToUse = userId && userId.trim() !== '' ? userId : idFromRequest;

    const user = await this.usersRepository.findOne({
      where: { id: userIdToUse },
      select: ['id', 'username', 'avatarUrl', 'rating', 'email'],
      relations: ['createdQuizzes', 'participatedQuizzes'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    console.log(user);

    const userInfo: UserInfoDto = {
      userId: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      rating: user.rating,
      email: user.email,
      participatedQuizzes:
        user.participatedQuizzes?.map((quiz) => new QuizPreviewDto(quiz)) || [],
      createdQuizzes:
        user.createdQuizzes?.map((quiz) => new QuizPreviewDto(quiz)) || [],
    };

    console.log(userInfo);

    return userInfo;
  }
}
