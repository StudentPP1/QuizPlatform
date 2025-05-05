import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EventEmitterService } from '@events/event-emitter.service';
import { Quiz } from '@quiz/entities/quiz.entity';
import { CreateReviewDto } from '@review/dto/create-review.dto';
import { ReviewDto } from '@review/dto/review.dto';
import { Review } from '@review/entities/review.entity';
import { User } from '@users/entities/user.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    private readonly eventEmitterService: EventEmitterService,
  ) {}

  async addReview(
    quizId: string,
    user: User,
    createReviewDto: CreateReviewDto,
  ) {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['creator'],
    });

    const review = this.reviewRepository.create({
      quiz,
      user,
      rating: createReviewDto.rating,
      comment: createReviewDto.text,
    });

    await this.reviewRepository.save(review);

    const newAuthorRating = await this.calculateAuthorAverageRating(
      quiz.creator.id,
    );

    await Promise.all([
      this.updateQuizRating(quiz),
      this.eventEmitterService.emit('user.rating_updated', {
        userId: quiz.creator.id,
        newRating: newAuthorRating,
      }),
    ]);

    return review;
  }

  private async calculateAuthorAverageRating(userId: string): Promise<number> {
    const reviews = await this.reviewRepository.find({
      where: { quiz: { creator: { id: userId } } },
    });

    console.log(reviews);

    if (!reviews.length) {
      return 0;
    }

    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    console.log(averageRating);

    return averageRating;
  }

  private async updateQuizRating(quiz: Quiz): Promise<void> {
    const reviews = await this.reviewRepository.find({
      where: { quiz: { id: quiz.id } },
    });

    if (!reviews.length) return;

    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    quiz.rating = Math.round(averageRating);
    await this.quizRepository.save(quiz);
  }

  async getReviewsForQuiz(quizId: string) {
    const reviews = await this.reviewRepository.find({
      where: { quiz: { id: quizId } },
      relations: ['user', 'user.createdQuizzes'],
    });

    return reviews.map((review) => new ReviewDto(review));
  }
}
