import { Inject, Injectable } from '@nestjs/common';

import { MemoizationCache } from '@common/cache/memoization-cache';
import { LRUStrategy } from '@common/cache/strategies/lru.strategy';
import {
  QUIZ_REPOSITORY,
  REVIEW_REPOSITORY,
} from '@common/constants/repository.constants';
import { IQuizRepository } from '@common/contracts/repositories/quiz.repository.contract';
import { IReviewRepository } from '@common/contracts/repositories/review.repository.contract';
import { IReviewService } from '@common/contracts/services/review.service.contract';
import { CreateReviewDto } from '@common/dto/create-review.dto';
import { ReviewPaginationDto } from '@common/dto/pagination.dto';
import { ReviewDto } from '@common/dto/review.dto';
import { eventEmitter } from '@common/events/event-emitter';
import { UpdateAuthorRatingOptions } from '@common/interfaces/update-author-rating-options.interface';
import { Quiz } from '@database/entities/quiz.entity';
import { Review } from '@database/entities/review.entity';
import { User } from '@database/entities/user.entity';

@Injectable()
export class ReviewService implements IReviewService {
  private cache = new MemoizationCache(new LRUStrategy(15));

  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviewRepository: IReviewRepository,
    @Inject(QUIZ_REPOSITORY)
    private quizRepository: IQuizRepository,
  ) {}

  async addReview(
    quizId: string,
    user: User,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    const quiz = await this.quizRepository.findOneByIdWithRelations(quizId, [
      'creator',
    ]);

    const review = this.reviewRepository.create(user, quiz, createReviewDto);

    this.cache.deleteByPrefix(`reviews:${quizId}`);

    await this.reviewRepository.insert(review);
    const newAuthorRating = await this.calculateAuthorAverageRating(
      quiz.creator.id,
    );
    await this.updateQuizRating(quiz);

    eventEmitter.emit<UpdateAuthorRatingOptions>('user.rating_updated', {
      userId: quiz.creator.id,
      newRating: newAuthorRating,
    });

    return review;
  }

  private async calculateAuthorAverageRating(userId: string): Promise<number> {
    const reviews = await this.reviewRepository.findByQuizCreatorId(userId);

    if (!reviews.length) {
      return 0;
    }

    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    return averageRating;
  }

  private async updateQuizRating(quiz: Quiz): Promise<void> {
    const reviews = await this.reviewRepository.findByQuizId(quiz.id);

    if (!reviews.length) return;

    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    await this.quizRepository.update(quiz.id, {
      rating: Math.round(averageRating),
    });
  }

  async getReviewsForQuiz(dto: ReviewPaginationDto): Promise<ReviewDto[]> {
    const { quizId, from, to } = dto;

    const reviews = await this.cache.getOrComputeAsync(
      `reviews:${quizId}:${from}:${to}`,
      () => this.reviewRepository.findByQuizId(quizId, from, to),
    );

    return reviews.map((review: Review) => new ReviewDto(review));
  }
}
