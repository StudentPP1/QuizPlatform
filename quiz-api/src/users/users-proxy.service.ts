import { MemoizationCache } from '@common/cache/memoization-cache';
import { TimeStrategy } from '@common/cache/strategies/ttl.strategy';
import { IUsersService } from '@common/contracts/services/users.service.contract';
import { CreateGoogleUserDto } from '@common/dto/create-google-user.dto';
import { CreateUserDto } from '@common/dto/create-user.dto';
import { BasePaginationDto } from '@common/dto/pagination.dto';
import { ProfileDto } from '@common/dto/profile.dto';
import { QuizPreviewDto } from '@common/dto/quiz-preview.dto';
import { AuthProvider } from '@common/enums/auth-provider.enum';
import { UpdateAuthorRatingOptions } from '@common/interfaces/update-author-rating-options.interface';
import { Queue } from '@common/queue/queue';
import { User } from '@users/entities/user.entity';
import { RealUsersService } from '@users/users.service';

export class ProxyUsersService implements IUsersService {
  private queue = new Queue(10, 100);
  private cache = new MemoizationCache(new TimeStrategy(15 * 60 * 1000));

  constructor(private readonly usersService: RealUsersService) {}

  getUserById(id: string): Promise<User | null> {
    return this.cache.getOrComputeAsync(`userId:${id}`, () =>
      this.queue.enqueue(() => this.usersService.getUserById(id)),
    );
  }

  createUser(
    userDto: CreateUserDto | CreateGoogleUserDto,
    authProvider: AuthProvider,
  ): Promise<User> {
    return this.queue.enqueue(() =>
      this.usersService.createUser(userDto, authProvider),
    );
  }

  getUserByEmail(email: string): Promise<User | null> {
    return this.cache.getOrComputeAsync(`email:${email}`, () =>
      this.queue.enqueue(() => this.usersService.getUserByEmail(email)),
    );
  }

  getUserInfo(userId: string): Promise<ProfileDto> {
    const key = `userId-info:${userId}`;

    return this.cache.getOrComputeAsync(key, () =>
      this.queue.enqueue(() => this.usersService.getUserInfo(userId)),
    );
  }

  getCreatedQuizzes(
    userId: string,
    paginationDto: BasePaginationDto,
  ): Promise<QuizPreviewDto[]> {
    return this.queue.enqueue(() =>
      this.usersService.getCreatedQuizzes(userId, paginationDto),
    );
  }

  async getParticipatedQuizzes(
    userId: string,
    paginationDto: BasePaginationDto,
  ): Promise<QuizPreviewDto[]> {
    return this.queue.enqueue(() =>
      this.usersService.getParticipatedQuizzes(userId, paginationDto),
    );
  }

  async getTopCreators(limit: number): Promise<ProfileDto[]> {
    const key = `top-creators:${limit}`;
    return this.cache.getOrComputeAsync(key, () =>
      this.queue.enqueue(() => this.usersService.getTopCreators(limit)),
    );
  }

  async updateAuthorRating(options: UpdateAuthorRatingOptions): Promise<void> {
    await this.queue.enqueue(() =>
      this.usersService.updateAuthorRating(options),
    );
  }
}
