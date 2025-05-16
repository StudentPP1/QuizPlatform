import { extname } from 'path';

import { BadRequestException, forwardRef, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

import { QuizResult } from '@quiz/entities/quiz-result.entity';
import { Quiz } from '@quiz/entities/quiz.entity';
import { QuizController } from '@quiz/quiz.controller';
import { QuizService } from '@quiz/quiz.service';
import { TaskModule } from '@task/task.module';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, QuizResult]),
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
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}
