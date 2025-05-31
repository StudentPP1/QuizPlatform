import { QuizResult } from '@database/entities/quiz-result.entity';
import { Quiz } from '@database/entities/quiz.entity';
import { User } from '@database/entities/user.entity';

export interface IQuizResultRepository {
  create(user: User, quiz: Quiz): QuizResult;
  save(quizResult: QuizResult): Promise<void>;
  findByQuizAndUserId(
    quizId: string,
    userId: string,
  ): Promise<QuizResult | null>;
}
