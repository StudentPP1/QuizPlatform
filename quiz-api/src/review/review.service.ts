import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from '../quiz/entities/quiz.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './entities/review.entity';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Quiz) private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
  ) {}

  async addReview(
    quizId: string,
    createReviewDto: CreateReviewDto,
    req: Request,
  ) {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['creator'],
    });
    const user = await this.userRepository.findOne({
      where: { id: req.user.id },
    });

    if (!quiz || !user) {
      throw new Error('Quiz or user not found');
    }

    const review = this.reviewRepository.create({
      quiz,
      user,
      ...createReviewDto,
    });

    await this.reviewRepository.save(review);
    await this.updateQuizRating(quizId);
    await this.usersService.updateAuthorRating(review.quiz.creator.id);

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

    quiz.averageRating = parseFloat(averageRating.toFixed(2));
    await this.quizRepository.save(quiz);
  }

  async getReviewsForQuiz(quizId: string) {
    return this.reviewRepository.find({ where: { quiz: { id: quizId } } });
  }
}
