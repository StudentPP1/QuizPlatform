import { Inject, Injectable } from '@nestjs/common';

import { MemoizationCache } from '@common/cache/memoization-cache';
import { LRUStrategy } from '@common/cache/strategies/lru.strategy';
import { QUIZ_REPOSITORY } from '@common/constants/quiz.constants';
import { REVIEW_REPOSITORY } from '@common/constants/review.constants';
import { IQuizRepository } from '@common/contracts/repositories/quiz.repository.contract';
import { IReviewRepository } from '@common/contracts/repositories/review.repository.contract';
import { CreateReviewDto } from '@common/dto/create-review.dto';
import { ReviewDto } from '@common/dto/review.dto';
import { EventEmitterService } from '@events/event-emitter.service';
import { Quiz } from '@quiz/entities/quiz.entity';
import { Review } from '@review/entities/review.entity';
import { User } from '@users/entities/user.entity';

@Injectable()
export class ReviewService {
  private cache = new MemoizationCache(new LRUStrategy(15));

  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviewRepository: IReviewRepository,
    @Inject(QUIZ_REPOSITORY)
    private quizRepository: IQuizRepository,
    private readonly eventEmitterService: EventEmitterService,
  ) {}

  async addReview(
    quizId: string,
    user: User,
    createReviewDto: CreateReviewDto,
  ) {
    const quiz = await this.quizRepository.findOneByIdWithRelations(quizId, [
      'creator',
    ]);

    const review = this.reviewRepository.create(user, quiz, createReviewDto);

    const newAuthorRating = await this.calculateAuthorAverageRating(
      quiz.creator.id,
    );

    const updatedReviews = await this.reviewRepository.findByQuizId(quizId);

    if (this.cache.has(`reviews:${quizId}`))
      this.cache.set(`reviews:${quizId}`, updatedReviews);

    await Promise.all([
      this.reviewRepository.save(review),
      this.updateQuizRating(quiz),
      this.eventEmitterService.emit('user.rating_updated', {
        userId: quiz.creator.id,
        newRating: newAuthorRating,
      }),
    ]);

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

    quiz.rating = Math.round(averageRating);
    await this.quizRepository.save(quiz);
  }

  async getReviewsForQuiz(quizId: string): Promise<ReviewDto[]> {
    const reviews = await this.cache.getOrComputeAsync(
      `reviews:${quizId}`,
      () => this.reviewRepository.findByQuizId(quizId),
    );

    return reviews.map((review: Review) => new ReviewDto(review));
  }
}
