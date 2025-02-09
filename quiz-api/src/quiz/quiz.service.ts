import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly usersService: UsersService,
  ) {}

  async createQuiz(
    createQuizDto: CreateQuizDto,
    tasks: CreateTaskDto[],
    req: Request,
  ) {
    const user = await this.usersService.findUserByEmail(req.user.email);

    const quiz = this.quizRepository.create({
      ...createQuizDto,
      creator: user,
    });

    await this.quizRepository.save(quiz);

    for (const taskDto of tasks) {
      const task = this.taskRepository.create({
        ...taskDto,
        quiz: quiz,
      });
      await this.taskRepository.save(task);
    }

    return quiz;
  }
}
