import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { Request } from 'express';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
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
      const task = this.taskRepository.create({
        ...taskDto,
        quiz: quiz,
      });
      return task;
    });

    await this.taskRepository.save(taskEntities);

    return quiz;
  }
}
