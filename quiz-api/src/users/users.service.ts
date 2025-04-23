import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Quiz } from '@quiz/entities/quiz.entity';
import { QuizService } from '@quiz/quiz.service';
import { CreateGoogleUserDto } from '@users/dto/create-google-user.dto';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { ProfileDto } from '@users/dto/profile.dto';
import { User } from '@users/entities/user.entity';
import { AuthProvider } from '@users/enum/auth-provider.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @Inject(forwardRef(() => QuizService))
    private readonly quizSerivce: QuizService,
  ) {}

  async getUserById(id: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ id });
  }

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
  ): Promise<ProfileDto> {
    const userIdToUse = userId && userId.trim() !== '' ? userId : idFromRequest;

    const user = await this.usersRepository.findOne({
      where: { id: userIdToUse },
      select: ['id', 'username', 'avatarUrl', 'rating', 'email'],
      relations: ['createdQuizzes'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userInfo = new ProfileDto(user);
    return userInfo;
  }

  async getCreatedQuizzes(userId: string, from: number, to: number) {
    return this.quizSerivce.getCreatedQuizzes(userId, from, to);
  }

  async getParticipatedQuizzes(userId: string, from: number, to: number) {
    return this.quizSerivce.getParticipatedQuizzes(userId, from, to);
  }

  async addQuizParticipation(userId: string, quiz: Quiz): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['participatedQuizzes'],
    });

    user.participatedQuizzes.push(quiz);
  }

  async getTopCreators(limit: number) {
    const users = await this.usersRepository.find({
      relations: ['createdQuizzes'],
      order: {
        rating: 'DESC',
      },
      take: limit,
    });

    return users.map((user) => new ProfileDto(user));
  }
}
