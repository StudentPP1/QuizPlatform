import { CreateQuizDto } from '@quiz/dto/create-quiz.dto';
import { FullQuizDto, QuizPreviewDto } from '@quiz/dto/quiz.dto';
import { SaveQuizResultDto } from '@quiz/dto/save-quiz-result.dto';
import { UpdateQuizDto } from '@quiz/dto/update-quiz.dto';
import { User } from '@users/entities/user.entity';

export interface IQuizService {
  createQuiz(dto: CreateQuizDto, user: User): Promise<object>;
  updateQuiz(
    quizId: string,
    updateQuizDto: UpdateQuizDto,
    user: User,
  ): Promise<object>;
  deleteQuiz(quizId: string, user: User): Promise<object>;
  saveResult(
    quizId: string,
    userId: string,
    dto: SaveQuizResultDto,
  ): Promise<any>;
  getQuiz(id: string): Promise<FullQuizDto>;
  searchQuizzesByName(name: string): Promise<QuizPreviewDto[]>;
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
