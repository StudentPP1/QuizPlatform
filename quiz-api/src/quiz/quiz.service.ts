import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { QuizResult } from './entities/quiz-result.entity';
import { ILike, Repository } from 'typeorm';
import { TaskService } from '../task/task.service';
import { UsersService } from '../users/users.service';
import { CreateTaskDto } from '../task/dto/create-task.dto';
import { SaveQuizResultDto } from './dto/save-quiz-result.dto';
import { Request } from 'express';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(QuizResult)
    private readonly quizResultRepository: Repository<QuizResult>,
    private readonly taskService: TaskService,
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

  async getTopQuizzes(limit: number) {
    const quizzes = await this.quizRepository.find({
      select: [
        'id',
        'title',
        'description',
        'numberOfTasks',
        'timeLimit',
        'rating',
      ],
      relations: ['creator', 'tasks'],
      order: {
        rating: 'DESC',
      },
      take: limit,
    });

    return quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      numberOfTasks: quiz.numberOfTasks,
      creator: {
        id: quiz.creator?.id,
        username: quiz.creator?.username,
        avatarUrl: quiz.creator?.avatarUrl,
      },
      tasks: quiz.tasks.map((task) => ({
        id: task.id,
        question: task.question,
        type: task.type,
        image: task.image,
        correctAnswers: task.correctAnswer,
        options: task.options,
      })),
    }));
  }

  async getQuizWithRelations(quizId: string) {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['creator', 'tasks'],
    });

    if (!quiz) {
      throw new Error('Quiz not found');
    }

    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      numberOfTasks: quiz.numberOfTasks,
      timeLimit: quiz.timeLimit,
      rating: quiz.rating,
      creator: {
        id: quiz.creator?.id,
        username: quiz.creator?.username,
        avatarUrl: quiz.creator?.avatarUrl,
      },
      tasks: quiz.tasks.map((task) => ({
        id: task.id,
        question: task.question,
        type: task.type,
        image: task.image,
        correctAnswers: task.correctAnswer,
        options: task.options,
      })),
    };
  }

  async getTopCreators(limit: number) {
    return this.usersService.getTopCreatorsInfo(limit);
  }

  async searchQuizzesByName(name: string) {
    return this.quizRepository
      .find({
        where: {
          title: ILike(`%${name}%`),
        },
        select: [
          'id',
          'title',
          'description',
          'numberOfTasks',
          'timeLimit',
          'rating',
        ],
        relations: ['creator', 'tasks'],
      })
      .then((quizzes) =>
        quizzes.map((quiz) => ({
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          numberOfTasks: quiz.numberOfTasks,
          timeLimit: quiz.timeLimit,
          rating: quiz.rating,
          creator: {
            id: quiz.creator?.id,
            username: quiz.creator?.username,
            avatarUrl: quiz.creator?.avatarUrl,
          },
          tasks: quiz.tasks.map((task) => ({
            id: task.id,
            question: task.question,
            type: task.type,
            image: task.image,
            correctAnswers: task.correctAnswer,
            options: task.options,
          })),
        })),
      );
  }
}
