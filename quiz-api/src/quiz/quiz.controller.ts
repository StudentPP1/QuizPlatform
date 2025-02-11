import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  Get,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDto } from '../task/dto/create-task.dto';
import { Request } from 'express';
import { QuizResult } from './entities/quiz-result.entity';
import { SaveQuizResultDto } from './dto/save-quiz-result.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('api/quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('create')
  async createQuiz(
    @Body() createQuizDto: CreateQuizDto,
    @Body('tasks') tasks: CreateTaskDto[],
    @Req() req: Request,
  ) {
    const quiz = await this.quizService.createQuiz(createQuizDto, tasks, req);
    return quiz;
  }

  @Post(':quizId/results')
  async saveResult(
    @Param('quizId') quizId: string,
    @Body() saveQuizResultDto: SaveQuizResultDto,
    @Req() req: Request,
  ): Promise<QuizResult> {
    return this.quizService.saveResult(quizId, req, saveQuizResultDto);
  }

  @Get('top-rate')
  async getTopQuizzes(limit: number = 3) {
    return this.quizService.getTopQuizzes(limit);
  }

  @Get('top-authors')
  async getTopAuthors(limit: number = 3) {
    return this.quizService.getTopAuthors(limit);
  }

  @Get(':id')
  async getQuizWithRelations(@Param('id') quizId: string) {
    return this.quizService.getQuizWithRelations(quizId);
  }
}
