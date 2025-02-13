import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { Quiz } from './entities/quiz.entity';
import { QuizResult } from './entities/quiz-result.entity';
import { TaskModule } from '../task/task.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, QuizResult, User]),
    TaskModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
