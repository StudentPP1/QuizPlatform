import { CreateReviewDto } from '@common/dto/create-review.dto';
import { ReviewPaginationDto } from '@common/dto/pagination.dto';
import { ReviewDto } from '@common/dto/review.dto';
import { Review } from '@review/entities/review.entity';
import { User } from '@users/entities/user.entity';

export interface IReviewService {
  addReview(quizId: string, user: User, dto: CreateReviewDto): Promise<Review>;
  getReviewsForQuiz(dto: ReviewPaginationDto): Promise<ReviewDto[]>;
}
