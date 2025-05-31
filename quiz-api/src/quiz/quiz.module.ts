import { extname } from 'path';

import {
  BASE_QUIZ_SERVICE,
  QUIZ_SERVICE,
  QUIZ_REPOSITORY,
  QUIZ_RESULT_REPOSITORY,
} from '@common/constants/quiz.constants';
import { BadRequestException, forwardRef, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { IQuizService } from '@common/contracts/services/quiz.service.contract';
import { QuizResultRepository } from '@database/repositories/quiz-result.repository';
import { QuizRepository } from '@database/repositories/quiz.repository';
import { ImageModule } from '@image/image.module';
import { LoggingQuizDecorator } from '@quiz/logging-quiz.decorator';
import { QuizController } from '@quiz/quiz.controller';
import { QuizService } from '@quiz/quiz.service';
import { TaskModule } from '@task/task.module';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
      limits: { fileSize: 5_000_000 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(
            new BadRequestException(
              `Unsupported file type ${extname(file.originalname)}`,
            ),
            false,
          );
        }

        cb(null, true);
      },
    }),
    TaskModule,
    ImageModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [QuizController],
  providers: [
    {
      provide: BASE_QUIZ_SERVICE,
      useClass: QuizService,
    },
    {
      provide: QUIZ_SERVICE,
      useFactory: (baseService: IQuizService) =>
        new LoggingQuizDecorator(baseService),
      inject: [BASE_QUIZ_SERVICE],
    },
    { provide: QUIZ_REPOSITORY, useClass: QuizRepository },
    { provide: QUIZ_RESULT_REPOSITORY, useClass: QuizResultRepository },
  ],
  exports: [QUIZ_SERVICE, QUIZ_REPOSITORY],
})
export class QuizModule {}
