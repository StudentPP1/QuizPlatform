import { extname } from 'path';

import { BadRequestException, forwardRef, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

import {
  BASE_QUIZ_SERVICE,
  QUIZ_SERVICE,
  QUIZ_REPOSITORY,
  QUIZ_RESULT_REPOSITORY,
} from '@common/constants/quiz.constants';
import { LoggingQuizDecorator } from '@quiz/logging-quiz.decorator';
import { QuizResultRepository } from '@quiz/quiz-result.repository';
import { QuizController } from '@quiz/quiz.controller';
import { QuizRepository } from '@quiz/quiz.repository';
import { QuizService } from '@quiz/quiz.service';
import { TaskModule } from '@task/task.module';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [
    MulterModule.register({
      limits: {
        fileSize: 5_000_000,
      },
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
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
    TaskModule,
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
      useFactory: (baseService) => new LoggingQuizDecorator(baseService),
      inject: [BASE_QUIZ_SERVICE],
    },
    { provide: QUIZ_REPOSITORY, useClass: QuizRepository },
    { provide: QUIZ_RESULT_REPOSITORY, useClass: QuizResultRepository },
  ],
  exports: [QUIZ_SERVICE, QUIZ_REPOSITORY],
})
export class QuizModule {}
