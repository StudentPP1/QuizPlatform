import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { MemoizationCache } from '@common/cache/memoization-cache';
import { TimeStrategy } from '@common/cache/strategies/ttl.strategy';
import {
  QUIZ_REPOSITORY,
  QUIZ_RESULT_REPOSITORY,
} from '@common/constants/quiz.constants';
import { TASK_SERVICE } from '@common/constants/task.constants';
import { USERS_SERVICE } from '@common/constants/users.constants';
import { IQuizResultRepository } from '@common/contracts/repositories/quiz-result.repository.contract';
import { IQuizRepository } from '@common/contracts/repositories/quiz.repository.contract';
import { IQuizService } from '@common/contracts/services/quiz.service.contract';
import { ITaskService } from '@common/contracts/services/task.service.contract';
import { IUsersService } from '@common/contracts/services/users.service.contract';
import { CreateQuizDto } from '@common/dto/create-quiz.dto';
import { FullQuizDto } from '@common/dto/full-quiz.dto';
import {
  BasePaginationDto,
  QuizPaginationDto,
} from '@common/dto/pagination.dto';
import { QuizPreviewDto } from '@common/dto/quiz-preview.dto';
import { UpdateQuizDto } from '@common/dto/update-quiz.dto';
import {
  MessageResponse,
  QuizIdResponse,
} from '@common/interfaces/response.interface';
import { Quiz } from '@quiz/entities/quiz.entity';
import { User } from '@users/entities/user.entity';

@Injectable()
export class QuizService implements IQuizService {
  private cache = new MemoizationCache(new TimeStrategy(15 * 60 * 1000));

  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
    @Inject(QUIZ_RESULT_REPOSITORY)
    private readonly quizResultRepository: IQuizResultRepository,
    @Inject(TASK_SERVICE) private readonly taskService: ITaskService,
    @Inject(forwardRef(() => USERS_SERVICE))
    private readonly usersService: IUsersService,
  ) {}

  async createQuiz(
    createQuizDto: CreateQuizDto,
    user: User,
    files: Express.Multer.File[],
  ): Promise<QuizIdResponse> {
    createQuizDto.tasks = this.attachImagesToTasks(createQuizDto.tasks, files);
    const quiz = this.quizRepository.create(createQuizDto, user);
    await this.quizRepository.save(quiz);

    await this.taskService.createTasks(createQuizDto.tasks, quiz);

    return {
      quizId: quiz.id,
      message: 'Quiz successfully created',
    };
  }

  async updateQuiz(
    quizId: string,
    dto: UpdateQuizDto,
    user: User,
    files: Express.Multer.File[],
  ): Promise<QuizIdResponse> {
    dto.tasks = this.attachImagesToTasks(dto.tasks, files);
    const quiz = await this.quizRepository.findOneByIdWithRelations(quizId, [
      'creator',
      'creator.createdQuizzes',
      'tasks',
    ]);

    if (!quiz) throw new NotFoundException('Quiz not found');
    if (quiz.creator.id !== user.id)
      throw new ForbiddenException('You are not the creator of this quiz');

    Object.assign(quiz, dto);
    await this.quizRepository.save(quiz);

    if (dto.tasks) {
      await this.taskService.updateTasks(quiz, dto.tasks);
    }

    if (this.cache.has(`quiz:${quiz.id}`))
      this.cache.set(`quiz:${quiz.id}`, quiz);

    return {
      quizId: quiz.id,
      message: 'Quiz successfully updated',
    };
  }

  private attachImagesToTasks<T extends { image?: string }>(
    tasks: T[],
    files: Express.Multer.File[],
  ): T[] {
    for (const file of files) {
      const match = file.fieldname.match(/images\[(\d+)\]/);
      if (match) {
        const index = parseInt(match[1], 10);
        if (tasks[index]) {
          tasks[index].image = `/uploads/${file.filename}`;
        }
      }
    }

    return tasks;
  }

  async deleteQuiz(id: string, user: User): Promise<MessageResponse> {
    const quiz = await this.quizRepository.findOneByIdWithRelations(id, [
      'creator',
      'tasks',
      'participants',
    ]);

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    if (quiz.creator.id !== user.id) {
      throw new ForbiddenException('You are not the creator of this quiz');
    }

    if (this.cache.has(`quiz:${quiz.id}`)) this.cache.remove(`quiz:${quiz.id}`);

    await this.taskService.deleteTasks(quiz.tasks);
    await this.quizRepository.remove(quiz);

    return { message: 'Quiz deleted successfully' };
  }

  async saveResult(quizId: string, userId: string): Promise<MessageResponse> {
    const user = await this.usersService.getUserById(userId);
    const quiz = await this.quizRepository.findOneByIdWithRelations(quizId, [
      'participants',
    ]);

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const existingResult = await this.quizResultRepository.findByQuizAndUserId(
      quizId,
      userId,
    );

    if (!existingResult) {
      const quizResult = this.quizResultRepository.create(user, quiz);
      quiz.participants.push(user);

      await Promise.all([
        this.quizRepository.save(quiz),
        this.usersService.addQuizParticipation(user, quiz),
        this.quizResultRepository.save(quizResult),
      ]);
    }

    return {
      message: 'Result successfully saved',
    };
  }

  async getQuiz(id: string): Promise<FullQuizDto> {
    const quiz = await this.cache.getOrComputeAsync(`quiz:${id}`, () =>
      this.quizRepository.findOneByIdWithRelations(id, [
        'creator',
        'creator.createdQuizzes',
        'tasks',
      ]),
    );

    if (!quiz) throw new NotFoundException('Quiz not found');

    return new FullQuizDto(quiz);
  }

  async searchQuizzesByName(dto: QuizPaginationDto): Promise<QuizPreviewDto[]> {
    const { name, from, to } = dto;

    const quizzes = await this.quizRepository.findByName(name, from, to);
    return quizzes.map((quiz) => new QuizPreviewDto(quiz));
  }

  async getTopQuizzes(limit: number): Promise<QuizPreviewDto[]> {
    const key = `top-quizzes:${limit}`;
    const quizzes = await this.cache.getOrComputeAsync(key, () =>
      this.quizRepository.findTopQuizzes(limit),
    );

    return quizzes.map((quiz: Quiz) => new QuizPreviewDto(quiz));
  }

  async getCreatedQuizzes(
    userId: string,
    paginationDto: BasePaginationDto,
  ): Promise<QuizPreviewDto[]> {
    const { from, to } = paginationDto;

    const quizzes = await this.quizRepository.findCreatedByUserId(
      userId,
      from,
      to,
    );

    return quizzes.map((quiz) => new QuizPreviewDto(quiz));
  }

  async getParticipatedQuizzes(
    userId: string,
    paginationDto: BasePaginationDto,
  ): Promise<QuizPreviewDto[]> {
    const { from, to } = paginationDto;

    const quizzes = await this.quizRepository.findParticipatedByUserId(
      userId,
      from,
      to,
    );

    return quizzes.map((quiz) => new QuizPreviewDto(quiz));
  }
}
