import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { Repository, ILike } from 'typeorm';
import { Task } from './entities/task.entity';
import { Request } from 'express';
import { CreateTaskDto } from './dto/create-task.dto';
import { UsersService } from '../users/users.service';
import { QuizResult } from './entities/quiz-result.entity';
import { SaveQuizResultDto } from './dto/save-quiz-result.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
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
      creator: req.user.id,
    });

    await this.quizRepository.save(quiz);

    const taskEntities = tasks.map((taskDto) => {
      return this.taskRepository.create({
        ...taskDto,
        quiz: quiz,
      });
    });

    await this.taskRepository.save(taskEntities);

    return quiz;
  }

  async saveResult(
    quizId: string,
    req: Request,
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
}
