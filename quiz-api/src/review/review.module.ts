import { Module } from '@nestjs/common';

import {
  REVIEW_REPOSITORY,
  REVIEW_SERVICE,
} from '@common/constants/review.constants';
import { QuizModule } from '@quiz/quiz.module';
import { ReviewController } from '@review/review.controller';
import { ReviewRepository } from '@review/review.repository';
import { ReviewService } from '@review/review.service';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [QuizModule, UsersModule],
  controllers: [ReviewController],
  providers: [
    {
      provide: REVIEW_REPOSITORY,
      useClass: ReviewRepository,
    },
    {
      provide: REVIEW_SERVICE,
      useClass: ReviewService,
    },
  ],
})
export class ReviewModule {}
