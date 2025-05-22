import { IQuizService } from '@common/contracts/quiz-service.contract';
import { CreateQuizDto } from '@common/dto/create-quiz.dto';
import { SaveQuizResultDto } from '@common/dto/save-quiz-result.dto';
import { UpdateQuizDto } from '@common/dto/update-quiz.dto';
import { quizServiceLogger } from '@common/logging/logger';
import { User } from '@users/entities/user.entity';

export class LoggingQuizDecorator implements IQuizService {
  private readonly logger = quizServiceLogger;

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

  createQuiz(dto: CreateQuizDto, user: User) {
    return this.logMethod('createQuiz', [dto, user], () =>
      this.wrapped.createQuiz(dto, user),
    );
  }

  updateQuiz(quizId: string, updateQuizDto: UpdateQuizDto, user: User) {
    return this.logMethod('updateQuiz', [quizId, updateQuizDto, user], () =>
      this.wrapped.updateQuiz(quizId, updateQuizDto, user),
    );
  }

  deleteQuiz(quizId: string, user: User) {
    return this.logMethod('deleteQuiz', [quizId, user], () =>
      this.wrapped.deleteQuiz(quizId, user),
    );
  }

  saveResult(quizId: string, userId: string, dto: SaveQuizResultDto) {
    return this.logMethod('saveResult', [quizId, userId, dto], () =>
      this.wrapped.saveResult(quizId, userId, dto),
    );
  }

  getQuiz(id: string) {
    return this.logMethod('getQuiz', [id], () => this.wrapped.getQuiz(id));
  }

  searchQuizzesByName(name: string) {
    return this.logMethod('searchQuizzesByName', [name], () =>
      this.wrapped.searchQuizzesByName(name),
    );
  }

  getTopQuizzes(limit: number) {
    return this.logMethod('getTopQuizzes', [limit], () =>
      this.wrapped.getTopQuizzes(limit),
    );
  }

  getCreatedQuizzes(userId: string, from: number, to: number) {
    return this.logMethod('getCreatedQuizzes', [userId, from, to], () =>
      this.wrapped.getCreatedQuizzes(userId, from, to),
    );
  }

  getParticipatedQuizzes(userId: string, from: number, to: number) {
    return this.logMethod('getParticipatedQuizzes', [userId, from, to], () =>
      this.wrapped.getParticipatedQuizzes(userId, from, to),
    );
  }
}
