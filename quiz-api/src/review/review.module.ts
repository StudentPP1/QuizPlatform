import { Module } from '@nestjs/common';

import {
  BASE_REVIEW_SERVICE,
  REVIEW_REPOSITORY,
  REVIEW_SERVICE,
} from '@common/constants/review.constants';
import { QuizModule } from '@quiz/quiz.module';
import { LoggingReviewDecorator } from '@review/logging-review.decorator';
import { ReviewController } from '@review/review.controller';
import { ReviewRepository } from '@review/review.repository';
import { ReviewService } from '@review/review.service';
import { IReviewService } from '@common/contracts/services/review.service.contract';
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
      provide: BASE_REVIEW_SERVICE,
      useClass: ReviewService,
    },
    {
      provide: REVIEW_SERVICE,
      useFactory: (baseService: IReviewService) =>
        new LoggingReviewDecorator(baseService),
      inject: [BASE_REVIEW_SERVICE],
    },
  ],
})
export class ReviewModule {}
