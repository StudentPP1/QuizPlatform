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
import { USERS_SERVICE } from '@common/constants/users.constants';
import { IQuizResultRepository } from '@common/contracts/repositories/quiz-result.repository.contract';
import { IQuizRepository } from '@common/contracts/repositories/quiz.repository.contract';
import { IQuizService } from '@common/contracts/services/quiz.service.contract';
import { IUsersService } from '@common/contracts/services/users.service.contract';
import { CreateQuizDto } from '@common/dto/create-quiz.dto';
import { FullQuizDto } from '@common/dto/full-quiz.dto';
import { QuizPreviewDto } from '@common/dto/quiz-preview.dto';
import { SaveQuizResultDto } from '@common/dto/save-quiz-result.dto';
import { UpdateQuizDto } from '@common/dto/update-quiz.dto';
import { Quiz } from '@quiz/entities/quiz.entity';
import { TaskService } from '@task/task.service';
import { User } from '@users/entities/user.entity';

@Injectable()
export class QuizService implements IQuizService {
  private cache = new MemoizationCache(new TimeStrategy(15 * 60 * 1000));

  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: IQuizRepository,
    @Inject(QUIZ_RESULT_REPOSITORY)
    private readonly quizResultRepository: IQuizResultRepository,
    private readonly taskService: TaskService,
    @Inject(forwardRef(() => USERS_SERVICE))
    private readonly usersService: IUsersService,
  ) {}

  async createQuiz(
    createQuizDto: CreateQuizDto,
    user: User,
    files: Express.Multer.File[],
  ): Promise<object> {
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
  ): Promise<object> {
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

  async deleteQuiz(id: string, user: User): Promise<object> {
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

  async saveResult(
    quizId: string,
    userId: string,
    saveQuizResultDto: SaveQuizResultDto,
  ): Promise<object> {
    const user = await this.usersService.getUserById(userId);
    const quiz = await this.quizRepository.findOneByIdWithRelations(quizId, [
      'participants',
    ]);

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const exestingResult = await this.quizResultRepository.findByQuizAndUserId(
      quizId,
      userId,
    );

    if (exestingResult) {
      const newResult = this.quizResultRepository.updateResult(
        exestingResult,
        saveQuizResultDto,
      );

      await this.quizResultRepository.save(newResult);
    } else {
      const quizResult = this.quizResultRepository.create(
        saveQuizResultDto,
        user,
        quiz,
      );

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

  async searchQuizzesByName(
    name: string,
    from: number,
    to: number,
  ): Promise<QuizPreviewDto[]> {
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
    from: number,
    to: number,
  ): Promise<QuizPreviewDto[]> {
    const quizzes = await this.quizRepository.findCreatedByUserId(
      userId,
      from,
      to,
    );

    return quizzes.map((quiz) => new QuizPreviewDto(quiz));
  }

  async getParticipatedQuizzes(
    userId: string,
    from: number,
    to: number,
  ): Promise<QuizPreviewDto[]> {
    const quizzes = await this.quizRepository.findParticipatedByUserId(
      userId,
      from,
      to,
    );

    return quizzes.map((quiz) => new QuizPreviewDto(quiz));
  }
}
