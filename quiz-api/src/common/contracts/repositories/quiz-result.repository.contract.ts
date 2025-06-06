import { QuizResult } from '@database/entities/quiz-result.entity';
import { Quiz } from '@database/entities/quiz.entity';
import { User } from '@database/entities/user.entity';

export interface IQuizResultRepository {
  create(user: User, quiz: Quiz): QuizResult;
  insert(quizResult: QuizResult): Promise<void>;
  update(id: string, data: Partial<QuizResult>): Promise<void>;
  findByQuizAndUserId(
    quizId: string,
    userId: string,
  ): Promise<QuizResult | null>;
}
