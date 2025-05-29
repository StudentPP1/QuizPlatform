import { IUsersService } from '@common/contracts/services/users.service.contract';
import { CreateGoogleUserDto } from '@common/dto/create-google-user.dto';
import { CreateUserDto } from '@common/dto/create-user.dto';
import { BasePaginationDto } from '@common/dto/pagination.dto';
import { ProfileDto } from '@common/dto/profile.dto';
import { QuizPreviewDto } from '@common/dto/quiz-preview.dto';
import { AuthProvider } from '@common/enums/auth-provider.enum';
import { UpdateAuthorRatingOptions } from '@common/interfaces/update-author-rating-options.interface';
import { baseLogger } from '@common/logging/logger';
import { User } from '@users/entities/user.entity';

export class LoggingUsersDecorator implements IUsersService {
  private readonly logger = baseLogger.child({ service: 'Users Service' });

  constructor(private readonly wrapped: IUsersService) {}

  private async logMethod<T>(
    methodName: string,
    args: unknown[],
    fn: () => Promise<T>,
  ): Promise<T> {
    this.logger.info(
      `Called ${methodName}(${args.map((arg) => JSON.stringify(arg)).join(', ')})`,
    );
    const start = Date.now();

    try {
      const result = await fn();
      const duration = Date.now() - start;
      this.logger.info(`Method ${methodName} completed in ${duration}ms`);
      return result;
    } catch (error) {
      this.logger.error(
        `Method ${methodName} failed: ${error instanceof Error ? error.message : error}`,
      );
      throw error;
    }
  }

  getUserById(id: string): Promise<User | null> {
    return this.logMethod(this.getUserById.name, [id], () =>
      this.wrapped.getUserById(id),
    );
  }

  getUserByEmail(email: string): Promise<User | null> {
    return this.logMethod(this.getUserByEmail.name, [email], () =>
      this.wrapped.getUserByEmail(email),
    );
  }

  createUser(
    userDto: CreateUserDto | CreateGoogleUserDto,
    authProvider: AuthProvider,
  ): Promise<User> {
    return this.logMethod(this.createUser.name, [userDto, authProvider], () =>
      this.wrapped.createUser(userDto, authProvider),
    );
  }

  getUserInfo(userId: string): Promise<ProfileDto> {
    return this.logMethod(this.getUserInfo.name, [userId], () =>
      this.wrapped.getUserInfo(userId),
    );
  }

  getCreatedQuizzes(
    userId: string,
    paginationDto: BasePaginationDto,
  ): Promise<QuizPreviewDto[]> {
    return this.logMethod(
      this.getCreatedQuizzes.name,
      [userId, paginationDto],
      () => this.wrapped.getCreatedQuizzes(userId, paginationDto),
    );
  }

  getParticipatedQuizzes(
    userId: string,
    paginationDto: BasePaginationDto,
  ): Promise<QuizPreviewDto[]> {
    return this.logMethod(
      this.getParticipatedQuizzes.name,
      [userId, paginationDto],
      () => this.wrapped.getParticipatedQuizzes(userId, paginationDto),
    );
  }

  getTopCreators(limit: number): Promise<ProfileDto[]> {
    return this.logMethod(this.getTopCreators.name, [limit], () =>
      this.wrapped.getTopCreators(limit),
    );
  }

  updateAuthorRating(options: UpdateAuthorRatingOptions): Promise<void> {
    return this.logMethod(this.updateAuthorRating.name, [options], () =>
      this.wrapped.updateAuthorRating(options),
    );
  }
}
