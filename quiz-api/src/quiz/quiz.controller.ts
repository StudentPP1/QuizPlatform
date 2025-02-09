import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDto } from './dto/create-task.dto';
import { Request } from 'express';

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
}
