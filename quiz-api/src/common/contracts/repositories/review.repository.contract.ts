import { CreateReviewDto } from '@common/dto/create-review.dto';
import { Quiz } from '@quiz/entities/quiz.entity';
import { Review } from '@review/entities/review.entity';
import { User } from '@users/entities/user.entity';

export interface IReviewRepository {
  create(user: User, quiz: Quiz, dto: CreateReviewDto): Review;
  save(review: Review): Promise<void>;
  findByQuizId(quizId: string, from?: number, to?: number): Promise<Review[]>;
  findByQuizCreatorId(userId: string): Promise<Review[]>;
}
