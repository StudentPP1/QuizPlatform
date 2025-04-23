import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtGuard } from '@common/guards/auth.guard';
import { CreateQuizDto } from '@quiz/dto/create-quiz.dto';
import { SaveQuizResultDto } from '@quiz/dto/save-quiz-result.dto';
import { QuizResult } from '@quiz/entities/quiz-result.entity';
import { QuizService } from '@quiz/quiz.service';
import { User } from '@users/entities/user.entity';

@UseGuards(JwtGuard)
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('create')
  async createQuiz(
    @Body() createQuizDto: CreateQuizDto,
    @Req() req: Request & { user?: User },
  ) {
    const quiz = await this.quizService.createQuiz(createQuizDto, req.user);
    return quiz;
  }

  @Post(':quizId/results')
  async saveResult(
    @Param('quizId') quizId: string,
    @Body() saveQuizResultDto: SaveQuizResultDto,
    @Req() req: Request & { user?: User },
  ): Promise<QuizResult> {
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
