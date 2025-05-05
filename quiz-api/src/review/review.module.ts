import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Quiz } from '@quiz/entities/quiz.entity';
import { Review } from '@review/entities/review.entity';
import { ReviewController } from '@review/review.controller';
import { ReviewService } from '@review/review.service';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Quiz]), UsersModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
