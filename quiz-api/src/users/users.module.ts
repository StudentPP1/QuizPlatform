import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Review } from '../review/entities/review.entity';
import { UsersController } from './users.controller';
import { Quiz } from '../quiz/entities/quiz.entity';
import { QuizResult } from '../quiz/entities/quiz-result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Review, Quiz, QuizResult])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
