import { IQuizService } from '@common/contracts/services/quiz.service.contract';
import { CreateQuizDto } from '@common/dto/create-quiz.dto';
import { FullQuizDto } from '@common/dto/full-quiz.dto';
import {
  BasePaginationDto,
  QuizPaginationDto,
} from '@common/dto/pagination.dto';
import { QuizPreviewDto } from '@common/dto/quiz-preview.dto';
import { UpdateQuizDto } from '@common/dto/update-quiz.dto';
import { baseLogger } from '@common/logging/logger';
import { User } from '@users/entities/user.entity';

export class LoggingQuizDecorator implements IQuizService {
  private readonly logger = baseLogger.child({ service: 'Quiz Service' });

  constructor(private readonly wrapped: IQuizService) {}

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

  createQuiz(
    dto: CreateQuizDto,
    user: User,
    files: Express.Multer.File[],
  ): Promise<object> {
    return this.logMethod('createQuiz', [dto, user], () =>
      this.wrapped.createQuiz(dto, user, files),
    );
  }

  updateQuiz(
    quizId: string,
    updateQuizDto: UpdateQuizDto,
    user: User,
    files: Express.Multer.File[],
  ): Promise<object> {
    return this.logMethod('updateQuiz', [quizId, updateQuizDto, user], () =>
      this.wrapped.updateQuiz(quizId, updateQuizDto, user, files),
    );
  }

  deleteQuiz(quizId: string, user: User): Promise<object> {
    return this.logMethod('deleteQuiz', [quizId, user], () =>
      this.wrapped.deleteQuiz(quizId, user),
    );
  }

  saveResult(quizId: string, userId: string): Promise<object> {
    return this.logMethod('saveResult', [quizId, userId], () =>
      this.wrapped.saveResult(quizId, userId),
    );
  }

  getQuiz(id: string): Promise<FullQuizDto> {
    return this.logMethod('getQuiz', [id], () => this.wrapped.getQuiz(id));
  }

  searchQuizzesByName(dto: QuizPaginationDto): Promise<QuizPreviewDto[]> {
    return this.logMethod('searchQuizzesByName', [dto], () =>
      this.wrapped.searchQuizzesByName(dto),
    );
  }

  getTopQuizzes(limit: number): Promise<QuizPreviewDto[]> {
    return this.logMethod('getTopQuizzes', [limit], () =>
      this.wrapped.getTopQuizzes(limit),
    );
  }

  getCreatedQuizzes(
    userId: string,
    paginationDto: BasePaginationDto,
  ): Promise<QuizPreviewDto[]> {
    return this.logMethod('getCreatedQuizzes', [userId, paginationDto], () =>
      this.wrapped.getCreatedQuizzes(userId, paginationDto),
    );
  }

  getParticipatedQuizzes(
    userId: string,
    paginationDto: BasePaginationDto,
  ): Promise<QuizPreviewDto[]> {
    return this.logMethod(
      'getParticipatedQuizzes',
      [userId, paginationDto],
      () => this.wrapped.getParticipatedQuizzes(userId, paginationDto),
    );
  }
}
