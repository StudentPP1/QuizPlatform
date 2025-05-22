import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, MoreThan, Repository } from 'typeorm';

import { MemoizationCache } from '@common/cache/memoization-cache';
import { LFUStrategy } from '@common/cache/strategies/lfu.strategy';
import { USERS_SERVICE } from '@common/constants/user.token';
import { IQuizService } from '@common/contracts/quiz-service.contract';
import { IUsersService } from '@common/contracts/users-service.contract';
import { CreateQuizDto } from '@common/dto/create-quiz.dto';
import { FullQuizDto } from '@common/dto/full-quiz.dto';
import { QuizPreviewDto } from '@common/dto/quiz-preview.dto';
import { SaveQuizResultDto } from '@common/dto/save-quiz-result.dto';
import { UpdateQuizDto } from '@common/dto/update-quiz.dto';
import { QuizResult } from '@quiz/entities/quiz-result.entity';
import { Quiz } from '@quiz/entities/quiz.entity';
import { TaskService } from '@task/task.service';
import { User } from '@users/entities/user.entity';

@Injectable()
export class QuizService implements IQuizService {
  private cache = new MemoizationCache(new LFUStrategy(3));

  constructor(
    @InjectRepository(Quiz) private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(QuizResult)
    private readonly quizResultRepository: Repository<QuizResult>,
    private readonly taskService: TaskService,
    @Inject(forwardRef(() => USERS_SERVICE))
    private readonly usersService: IUsersService,
  ) {}

  async createQuiz(createQuizDto: CreateQuizDto, user: User) {
    const quiz = this.quizRepository.create({
      ...createQuizDto,
      creator: user,
    });

    await this.quizRepository.save(quiz);
    await this.taskService.createTasks(createQuizDto.tasks, quiz);

    return {
      quizId: quiz.id,
      message: 'Quiz successfully created',
    };
  }

  async updateQuiz(quizId: string, updateQuizDto: UpdateQuizDto, user: User) {
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['creator', 'tasks'],
    });

    if (!quiz) throw new NotFoundException('Quiz not found');
    if (quiz.creator.id !== user.id)
      throw new ForbiddenException('Not your quiz');

    if (this.cache.has(`quiz:${quizId}`)) this.cache.remove(`quiz:${quizId}`);

    Object.assign(quiz, updateQuizDto);
    await this.quizRepository.save(quiz);

    if (updateQuizDto.tasks) {
      await this.taskService.updateTasks(quiz, updateQuizDto.tasks);
    }

    return {
      quizId: quiz.id,
      message: 'Quiz successfully updated',
    };
  }

  async deleteQuiz(id: string, user: User) {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: ['creator', 'participants', 'tasks', 'results', 'reviews'],
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    if (quiz.creator.id !== user.id) {
      throw new ForbiddenException('You are not the creator of this quiz');
    }

    if (this.cache.has(`quiz:${quiz.id}`)) this.cache.remove(`quiz:${quiz.id}`);

    quiz.participants = [];
    await this.quizRepository.save(quiz);
    await this.taskService.deleteTasks(quiz.tasks);
    await this.quizRepository.remove(quiz);

    return { message: 'Quiz deleted successfully' };
  }

  async saveResult(
    quizId: string,
    userId: string,
    saveQuizResultDto: SaveQuizResultDto,
  ): Promise<object> {
    const user = await this.usersService.getUserById(userId);
    const quiz = await this.quizRepository.findOne({
      where: { id: quizId },
      relations: ['participants'],
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const result = this.quizResultRepository.create({
      user,
      quiz,
      ...saveQuizResultDto,
    });

    quiz.participants.push(user);
    await this.quizRepository.save(quiz);

    await this.usersService.addQuizParticipation(user, quiz);

    await this.quizResultRepository.save(result);

    return {
      message: 'Result successfully saved',
    };
  }

  async getQuiz(quizId: string) {
    const quiz = await this.cache.getOrComputeAsync(`quiz:${quizId}`, () =>
      this.quizRepository.findOne({
        where: { id: quizId },
        relations: ['creator', 'creator.createdQuizzes', 'tasks'],
      }),
    );

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return new FullQuizDto(quiz);
  }

  async searchQuizzesByName(name: string) {
    const quizzes = await this.quizRepository.find({
      where: { title: ILike(`%${name}%`) },
      relations: ['creator', 'creator.createdQuizzes'],
    });

    return quizzes.map((quiz) => new QuizPreviewDto(quiz));
  }

  async getTopQuizzes(limit: number) {
    const key = `top-quizzes:${limit}`;

    const quizzes = await this.cache.getOrComputeAsync(key, () =>
      this.quizRepository.find({
        where: { rating: MoreThan(0) },
        relations: ['creator', 'creator.createdQuizzes'],
        order: { rating: 'DESC' },
        take: limit,
      }),
    );

    return quizzes.map((quiz) => new QuizPreviewDto(quiz));
  }

  async getCreatedQuizzes(
    userId: string,
    from: number,
    to: number,
  ): Promise<QuizPreviewDto[]> {
    const quizzes = await this.quizRepository.find({
      where: { creator: { id: userId } },
      relations: ['creator', 'creator.createdQuizzes'],
      skip: from - 1,
      take: to - from,
    });

    return quizzes.map((quiz) => new QuizPreviewDto(quiz));
  }

  async getParticipatedQuizzes(
    userId: string,
    from: number,
    to: number,
  ): Promise<QuizPreviewDto[]> {
    const quizzes = await this.quizRepository.find({
      where: {
        participants: { id: userId },
      },
      relations: ['participants', 'creator', 'creator.createdQuizzes'],
      skip: from - 1,
      take: to - from,
    });

    return quizzes.map((quiz) => new QuizPreviewDto(quiz));
  }
}
