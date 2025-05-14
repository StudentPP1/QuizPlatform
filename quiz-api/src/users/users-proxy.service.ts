import { Injectable } from '@nestjs/common';

import { MemoizationCache } from '@common/cache/memoization-cache';
import { TimeStrategy } from '@common/cache/strategies/ttl.strategy';
import { Queue } from '@common/queue/queue';
import { UpdateAuthorRatingOptions } from '@events/interfaces/update-author-rating-options.interface';
import { QuizPreviewDto } from '@quiz/dto/quiz.dto';
import { Quiz } from '@quiz/entities/quiz.entity';
import { CreateGoogleUserDto } from '@users/dto/create-google-user.dto';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { ProfileDto } from '@users/dto/profile.dto';
import { User } from '@users/entities/user.entity';
import { AuthProvider } from '@users/enum/auth-provider.enum';
import { IUsersService } from '@users/users-service.interface';
import { RealUsersService } from '@users/users.service';

@Injectable()
export class ProxyUsersService implements IUsersService {
  private queue = new Queue(10, 100);
  private cache = new MemoizationCache(new TimeStrategy(3600));

  constructor(private readonly usersService: RealUsersService) {}

  async getUserById(id: string): Promise<User | null> {
    return await this.cache.getOrComputeAsync(`userId:${id}`, () =>
      this.queue.enqueue(() => this.usersService.getUserById(id)),
    );
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.cache.getOrComputeAsync(`email:${email}`, () =>
      this.queue.enqueue(() => this.usersService.getUserByEmail(email)),
    );
  }

  async createUser<T extends CreateUserDto | CreateGoogleUserDto>(
    userDto: T,
    authProvider: AuthProvider,
  ): Promise<User> {
    return await this.queue.enqueue(() =>
      this.usersService.createUser(userDto, authProvider),
    );
  }

  async getUserInfo(userId: string): Promise<ProfileDto> {
    const key = `userId-info:${userId}`;

    return await this.cache.getOrComputeAsync(key, () =>
      this.queue.enqueue(() => this.usersService.getUserInfo(userId)),
    );
  }

  async getCreatedQuizzes(
    userId: string,
    from: number,
    to: number,
  ): Promise<QuizPreviewDto[]> {
    return await this.queue.enqueue(() =>
      this.usersService.getCreatedQuizzes(userId, from, to),
    );
  }

  async getParticipatedQuizzes(
    userId: string,
    from: number,
    to: number,
  ): Promise<QuizPreviewDto[]> {
    return await this.queue.enqueue(() =>
      this.usersService.getParticipatedQuizzes(userId, from, to),
    );
  }

  async addQuizParticipation(user: User, quiz: Quiz): Promise<void> {
    return await this.queue.enqueue(() =>
      this.usersService.addQuizParticipation(user, quiz),
    );
  }

  async getTopCreators(limit: number) {
    const key = `top-creators:${limit}`;
    return await this.cache.getOrComputeAsync(key, () =>
      this.queue.enqueue(() => this.usersService.getTopCreators(limit)),
    );
  }

  async updateAuthorRating(options: UpdateAuthorRatingOptions): Promise<void> {
    this.queue.enqueue(() => this.usersService.updateAuthorRating(options));
  }
}
