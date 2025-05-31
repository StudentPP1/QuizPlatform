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
import { User } from '@database/entities/user.entity';

export interface IQuizService {
  createQuiz(
    dto: CreateQuizDto,
    user: User,
    files: Express.Multer.File[],
  ): Promise<QuizIdResponse>;
  updateQuiz(
    quizId: string,
    updateQuizDto: UpdateQuizDto,
    user: User,
    files: Express.Multer.File[],
  ): Promise<QuizIdResponse>;
  deleteQuiz(quizId: string, user: User): Promise<MessageResponse>;
  saveResult(quizId: string, userId: string): Promise<MessageResponse>;
  getQuiz(id: string): Promise<FullQuizDto>;
  searchQuizzesByName(dto: QuizPaginationDto): Promise<QuizPreviewDto[]>;
  getTopQuizzes(limit: number): Promise<QuizPreviewDto[]>;
  getCreatedQuizzes(
    userId: string,
    paginationDto: BasePaginationDto,
  ): Promise<QuizPreviewDto[]>;
  getParticipatedQuizzes(
    userId: string,
    paginationDto: BasePaginationDto,
  ): Promise<QuizPreviewDto[]>;
}
