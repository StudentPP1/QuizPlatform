import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuizResult } from '@quiz/entities/quiz-result.entity';
import { Quiz } from '@quiz/entities/quiz.entity';
import { QuizController } from '@quiz/quiz.controller';
import { QuizService } from '@quiz/quiz.service';
import { TaskModule } from '@task/task.module';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, QuizResult]),
    TaskModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}
