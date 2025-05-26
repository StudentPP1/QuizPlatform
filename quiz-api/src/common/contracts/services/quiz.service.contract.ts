import { CreateQuizDto } from '@common/dto/create-quiz.dto';
import { FullQuizDto } from '@common/dto/full-quiz.dto';
import { QuizPreviewDto } from '@common/dto/quiz-preview.dto';
import { SaveQuizResultDto } from '@common/dto/save-quiz-result.dto';
import { UpdateQuizDto } from '@common/dto/update-quiz.dto';
import { User } from '@users/entities/user.entity';

export interface IQuizService {
  createQuiz(
    dto: CreateQuizDto,
    user: User,
    files: Express.Multer.File[],
  ): Promise<object>;
  updateQuiz(
    quizId: string,
    updateQuizDto: UpdateQuizDto,
    user: User,
    files: Express.Multer.File[],
  ): Promise<object>;
  deleteQuiz(quizId: string, user: User): Promise<object>;
  saveResult(
    quizId: string,
    userId: string,
    dto: SaveQuizResultDto,
  ): Promise<object>;
  getQuiz(id: string): Promise<FullQuizDto>;
  searchQuizzesByName(
    name: string,
    from: number,
    to: number,
  ): Promise<QuizPreviewDto[]>;
  getTopQuizzes(limit: number): Promise<QuizPreviewDto[]>;
  getCreatedQuizzes(
    userId: string,
    from: number,
    to: number,
  ): Promise<QuizPreviewDto[]>;
  getParticipatedQuizzes(
    userId: string,
    from: number,
    to: number,
  ): Promise<QuizPreviewDto[]>;
}
