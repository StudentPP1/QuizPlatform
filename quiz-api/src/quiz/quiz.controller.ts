import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  Get,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Request } from 'express';

import { JwtGuard } from '@common/guards/jwt.guard';
import { CreateQuizDto } from '@quiz/dto/create-quiz.dto';
import { SaveQuizResultDto } from '@quiz/dto/save-quiz-result.dto';
import { QuizService } from '@quiz/quiz.service';
import { User } from '@users/entities/user.entity';

@UseGuards(JwtGuard)
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('create')
  @UseInterceptors(AnyFilesInterceptor())
  async createQuiz(
    @Body('quiz') quizRaw: string,
    @Req() req: Request & { user?: User },
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const createQuizDto = plainToInstance(CreateQuizDto, JSON.parse(quizRaw));
    await validateOrReject(createQuizDto);

    for (const file of files) {
      const match = file.fieldname.match(/images\[(\d+)\]/);
      if (match) {
        const index = parseInt(match[1], 10);
        if (createQuizDto.tasks[index]) {
          createQuizDto.tasks[index].image = `/uploads/${file.filename}`;
        }
      }
    }

    const quiz = await this.quizService.createQuiz(createQuizDto, req.user);
    return quiz;
  }

  @Post(':quizId/results')
  async saveResult(
    @Param('quizId') quizId: string,
    @Body() saveQuizResultDto: SaveQuizResultDto,
    @Req() req: Request & { user?: User },
  ) {
    return this.quizService.saveResult(quizId, req.user.id, saveQuizResultDto);
  }

  @Get(':quizId/info')
  async getQuiz(@Param('quizId') quizId: string) {
    return this.quizService.getQuiz(quizId);
  }

  @Get('search')
  async searchQuizzes(@Query('name') name: string) {
    return this.quizService.searchQuizzesByName(name);
  }

  @Get('top-rated')
  async getTopQuizzes(@Query('limit') limit: number = 3) {
    return this.quizService.getTopQuizzes(limit);
  }
}
