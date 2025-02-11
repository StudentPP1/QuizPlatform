import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { Repository } from 'typeorm';
import { TaskService } from '../task/task.service';
import { UsersService } from '../users/users.service';
import { QuizResult } from './entities/quiz-result.entity';
import { SaveQuizResultDto } from './dto/save-quiz-result.dto';
import { Request } from 'express';
import { CreateTaskDto } from '../task/dto/create-task.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    private readonly taskService: TaskService,
    @InjectRepository(QuizResult)
    private readonly quizResultRepository: Repository<QuizResult>,
    private readonly usersService: UsersService,
  ) {}

  async createQuiz(
    createQuizDto: CreateQuizDto,
    tasks: CreateTaskDto[],
    req: Request,
  ) {
    const quiz = this.quizRepository.create({
      ...createQuizDto,
      creator: req.user,
    });

    await this.quizRepository.save(quiz);

    await this.taskService.createTasks(tasks, quiz);

    return quiz;
  }

  async saveResult(
    quizId: string,
    req: any,
    saveQuizResultDto: SaveQuizResultDto,
  ): Promise<QuizResult> {
    const [user, quiz] = await Promise.all([
      this.usersService.findUserById(req.user.id),
      this.quizRepository.findOne({ where: { id: quizId } }),
    ]);

    if (!user || !quiz) {
      throw new Error('User or Quiz not found');
    }

    const result = this.quizResultRepository.create({
      user,
      quiz,
      ...saveQuizResultDto,
    });

    return this.quizResultRepository.save(result);
  }

  async getQuizWithRelations(quizId: string) {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['creator', 'tasks', 'results', 'participants', 'reviews'],
    });

    if (!quiz) {
      throw new Error('Quiz not found');
    }

    return quiz;
  }
}
