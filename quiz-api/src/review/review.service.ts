import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from '../quiz/entities/quiz.entity';
import { User } from '../users/entities/user.entity';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Request } from 'express';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Quiz) private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly usersService: UsersService,
  ) {}

  async addReview(
    quizId: string,
    createReviewDto: CreateReviewDto,
    req: Request,
  ) {
    const [quiz, user] = await Promise.all([
      this.quizRepository.findOne({
        where: { id: quizId },
        relations: ['creator'],
      }),
      this.userRepository.findOne({
        where: { id: req.user.id },
      }),
    ]);

    if (!quiz || !user) {
      throw new Error('Quiz or user not found');
    }

    const review = this.reviewRepository.create({
      quiz,
      user,
      ...createReviewDto,
    });

    await this.reviewRepository.save(review);

    await Promise.all([
      this.updateQuizRating(quizId),
      this.usersService.updateAuthorRating(review.quiz.creator.id),
    ]);

    return review;
  }

  async updateQuizRating(quizId: string): Promise<void> {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['reviews'],
    });

    if (!quiz) {
      throw new Error('Quiz not found');
    }

    const reviews = await this.reviewRepository.find({
      where: { quiz: { id: quizId } },
    });

    if (reviews.length === 0) return;

    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    quiz.rating = parseFloat(averageRating.toFixed(2));
    await this.quizRepository.save(quiz);
  }

  async getReviewsForQuiz(quizId: string) {
    const reviews = await this.reviewRepository.find({
      where: { quiz: { id: quizId } },
      relations: ['creator'],
    });

    return reviews.map((review) => ({
      creator: {
        id: review.user?.id,
        username: review.user?.username,
        avatarUrl: review.user?.avatarUrl,
      },
      text: review.comment,
      rating: review.rating,
    }));
  }
}
