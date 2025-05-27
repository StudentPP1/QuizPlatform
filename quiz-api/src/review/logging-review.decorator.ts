import { IReviewService } from '@common/contracts/services/review.service.contract';
import { CreateReviewDto } from '@common/dto/create-review.dto';
import { ReviewPaginationDto } from '@common/dto/pagination.dto';
import { ReviewDto } from '@common/dto/review.dto';
import { baseLogger } from '@common/logging/logger';
import { Review } from '@review/entities/review.entity';
import { User } from '@users/entities/user.entity';

export class LoggingReviewDecorator implements IReviewService {
  private readonly logger = baseLogger.child({ service: 'Review Service' });

  constructor(private readonly wrapped: IReviewService) {}

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

  addReview(quizId: string, user: User, dto: CreateReviewDto): Promise<Review> {
    return this.logMethod('addReview', [quizId, user, dto], () =>
      this.wrapped.addReview(quizId, user, dto),
    );
  }

  getReviewsForQuiz(dto: ReviewPaginationDto): Promise<ReviewDto[]> {
    return this.logMethod('getReviewsForQuiz', [dto], () =>
      this.wrapped.getReviewsForQuiz(dto),
    );
  }
}
