import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';

import { IQUIZ_SERVICE } from '@common/constants/quiz.token';
import { IQuizService } from '@common/contracts/quiz-service.contract';
import { IUsersService } from '@common/contracts/users-service.contract';
import { CreateGoogleUserDto } from '@common/dto/create-google-user.dto';
import { CreateUserDto } from '@common/dto/create-user.dto';
import { ProfileDto } from '@common/dto/profile.dto';
import { QuizPreviewDto } from '@common/dto/quiz-preview.dto';
import { AuthProvider } from '@common/enums/auth-provider.enum';
import { UpdateAuthorRatingOptions } from '@common/interfaces/update-author-rating-options.interface';
import { Quiz } from '@quiz/entities/quiz.entity';
import { User } from '@users/entities/user.entity';

@Injectable()
export class RealUsersService implements IUsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @Inject(forwardRef(() => IQUIZ_SERVICE))
    private readonly quizService: IQuizService,
  ) {}

  async getUserById(id: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'username', 'createdQuizzes', 'participatedQuizzes'],
      relations: ['createdQuizzes', 'participatedQuizzes'],
    });
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

  async getUserInfo(userId: string): Promise<ProfileDto> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['id', 'username', 'avatarUrl', 'rating', 'email'],
      relations: ['createdQuizzes'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userInfo = new ProfileDto(user);
    return userInfo;
  }

  async getCreatedQuizzes(
    userId: string,
    from: number,
    to: number,
  ): Promise<QuizPreviewDto[]> {
    return this.quizService.getCreatedQuizzes(userId, from, to);
  }

  async getParticipatedQuizzes(
    userId: string,
    from: number,
    to: number,
  ): Promise<QuizPreviewDto[]> {
    return this.quizService.getParticipatedQuizzes(userId, from, to);
  }

  async addQuizParticipation(user: User, quiz: Quiz): Promise<void> {
    user.participatedQuizzes.push(quiz);
    await this.usersRepository.save(user);
  }

  async getTopCreators(limit: number) {
    const users = await this.usersRepository.find({
      where: { rating: MoreThan(0) },
      relations: ['createdQuizzes'],
      order: {
        rating: 'DESC',
      },
      take: limit,
    });

    return users.map((user) => new ProfileDto(user));
  }

  async updateAuthorRating(options: UpdateAuthorRatingOptions): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: options.userId },
    });

    user.rating = Math.round(options.newRating);

    await this.usersRepository.save(user);
  }
}
