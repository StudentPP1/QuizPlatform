import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';

import { QUIZ_SERVICE } from '@common/constants/quiz.constants';
import { USERS_REPOSITORY } from '@common/constants/users.constants';
import { IUsersRepository } from '@common/contracts/repositories/users.repository.contract';
import { IQuizService } from '@common/contracts/services/quiz.service.contract';
import { IUsersService } from '@common/contracts/services/users.service.contract';
import { CreateGoogleUserDto } from '@common/dto/create-google-user.dto';
import { CreateUserDto } from '@common/dto/create-user.dto';
import { ProfileDto } from '@common/dto/profile.dto';
import { AuthProvider } from '@common/enums/auth-provider.enum';
import { UpdateAuthorRatingOptions } from '@common/interfaces/update-author-rating-options.interface';
import { Quiz } from '@quiz/entities/quiz.entity';
import { User } from '@users/entities/user.entity';

@Injectable()
export class RealUsersService implements IUsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
    @Inject(forwardRef(() => QUIZ_SERVICE))
    private readonly quizService: IQuizService,
  ) {}

  async getUserById(id: string): Promise<User | null> {
    return this.usersRepository.findOneById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneByEmail(email);
  }

  async createUser(
    userDto: CreateUserDto | CreateGoogleUserDto,
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

    await this.usersRepository.save(user);
    return user;
  }

  async getUserInfo(userId: string): Promise<ProfileDto> {
    const user = await this.usersRepository.findOneById(userId);
    if (!user) throw new NotFoundException('User not found');
    return new ProfileDto(user);
  }

  async getCreatedQuizzes(userId: string, from: number, to: number) {
    return this.quizService.getCreatedQuizzes(userId, from, to);
  }

  async getParticipatedQuizzes(userId: string, from: number, to: number) {
    return this.quizService.getParticipatedQuizzes(userId, from, to);
  }

  async addQuizParticipation(user: User, quiz: Quiz): Promise<void> {
    user.participatedQuizzes.push(quiz);
    await this.usersRepository.save(user);
  }

  async getTopCreators(limit: number) {
    const users = await this.usersRepository.findTopCreators(limit);
    return users.map((user) => new ProfileDto(user));
  }

  async updateAuthorRating(options: UpdateAuthorRatingOptions) {
    const user = await this.usersRepository.findOneById(options.userId);
    user.rating = Math.round(options.newRating);
    await this.usersRepository.save(user);
  }
}
