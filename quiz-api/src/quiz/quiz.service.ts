import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { CreateQuizDto } from '@quiz/dto/create-quiz.dto';
import { FullQuizDto, QuizPreviewDto } from '@quiz/dto/quiz.dto';
import { SaveQuizResultDto } from '@quiz/dto/save-quiz-result.dto';
import { QuizResult } from '@quiz/entities/quiz-result.entity';
import { Quiz } from '@quiz/entities/quiz.entity';
import { TaskService } from '@task/task.service';
import { User } from '@users/entities/user.entity';
import { UsersService } from '@users/users.service';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz) private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(QuizResult)
    private readonly quizResultRepository: Repository<QuizResult>,
    private readonly taskService: TaskService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async createQuiz(createQuizDto: CreateQuizDto, user: User) {
    const quiz = this.quizRepository.create({
      ...createQuizDto,
      creator: user,
    });

    await this.quizRepository.save(quiz);
    await this.taskService.createTasks(createQuizDto.tasks, quiz);

    return quiz;
  }

  async saveResult(
    quizId: string,
    userId: string,
    saveQuizResultDto: SaveQuizResultDto,
  ): Promise<QuizResult> {
    const user = await this.usersService.getUserById(userId);
    const quiz = await this.quizRepository.findOne({ where: { id: quizId } });

    if (!user || !quiz) {
      throw new NotFoundException('Quiz or user not found');
    }

    const result = this.quizResultRepository.create({
      user,
      quiz,
      ...saveQuizResultDto,
    });

    await this.quizResultRepository.save(result);

    await this.usersService.addQuizParticipation(userId, quiz);

    return this.quizResultRepository.save(result);
  }

  async getQuiz(quizId: string) {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['creator', 'creator.createdQuizzes', 'tasks'],
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return new FullQuizDto(quiz);
  }

  async searchQuizzesByName(name: string) {
    const quizzes = await this.quizRepository.find({
      where: {
        title: ILike(`%${name}%`),
      },
      relations: ['creator', 'creator.createdQuizzes', 'tasks'],
    });

    return quizzes.map((quiz) => new FullQuizDto(quiz));
  }

  async getTopQuizzes(limit: number) {
    const quizzes = await this.quizRepository.find({
      relations: ['creator', 'creator.createdQuizzes', 'tasks'],
      order: {
        rating: 'DESC',
      },
      take: limit,
    });

    return quizzes.map((quiz) => new FullQuizDto(quiz));
  }

  async getCreatedQuizzes(userId: string, from: number, to: number) {
    const quizzes = await this.quizRepository.find({
      where: { creator: { id: userId } },
      relations: ['creator', 'creator.createdQuizzes'],
      skip: from - 1,
      take: to - from,
    });

    return quizzes.map((quiz) => new QuizPreviewDto(quiz));
  }

  async getParticipatedQuizzes(userId: string, from: number, to: number) {
    const quizzes = await this.quizRepository.find({
      where: {
        participants: { id: userId },
      },
      relations: ['participants'],
      skip: from - 1,
      take: to - from,
    });

    return quizzes.map((quiz) => new QuizPreviewDto(quiz));
  }
}
