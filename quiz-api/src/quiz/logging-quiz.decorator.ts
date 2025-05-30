import { IQuizService } from '@common/contracts/services/quiz.service.contract';
import { CreateQuizDto } from '@common/dto/create-quiz.dto';
import { FullQuizDto } from '@common/dto/full-quiz.dto';
import {
  BasePaginationDto,
  QuizPaginationDto,
} from '@common/dto/pagination.dto';
import { QuizPreviewDto } from '@common/dto/quiz-preview.dto';
import { UpdateQuizDto } from '@common/dto/update-quiz.dto';
import {
  MessageResponse,
  QuizIdResponse,
} from '@common/interfaces/response.interface';
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
  ): Promise<QuizIdResponse> {
    return this.logMethod(this.createQuiz.name, [dto, user], () =>
      this.wrapped.createQuiz(dto, user, files),
    );
  }

  updateQuiz(
    quizId: string,
    updateQuizDto: UpdateQuizDto,
    user: User,
    files: Express.Multer.File[],
  ): Promise<QuizIdResponse> {
    return this.logMethod(
      this.updateQuiz.name,
      [quizId, updateQuizDto, user],
      () => this.wrapped.updateQuiz(quizId, updateQuizDto, user, files),
    );
  }

  deleteQuiz(quizId: string, user: User): Promise<MessageResponse> {
    return this.logMethod(this.deleteQuiz.name, [quizId, user], () =>
      this.wrapped.deleteQuiz(quizId, user),
    );
  }

  saveResult(quizId: string, userId: string): Promise<MessageResponse> {
    return this.logMethod(this.saveResult.name, [quizId, userId], () =>
      this.wrapped.saveResult(quizId, userId),
    );
  }

  getQuiz(id: string): Promise<FullQuizDto> {
    return this.logMethod(this.getQuiz.name, [id], () =>
      this.wrapped.getQuiz(id),
    );
  }

  searchQuizzesByName(dto: QuizPaginationDto): Promise<QuizPreviewDto[]> {
    return this.logMethod(this.searchQuizzesByName.name, [dto], () =>
      this.wrapped.searchQuizzesByName(dto),
    );
  }

  getTopQuizzes(limit: number): Promise<QuizPreviewDto[]> {
    return this.logMethod(this.getTopQuizzes.name, [limit], () =>
      this.wrapped.getTopQuizzes(limit),
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
}
