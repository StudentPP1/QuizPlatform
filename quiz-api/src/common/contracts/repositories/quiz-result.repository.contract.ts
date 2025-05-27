import { QuizResult } from '@quiz/entities/quiz-result.entity';
import { Quiz } from '@quiz/entities/quiz.entity';
import { User } from '@users/entities/user.entity';

export interface IQuizResultRepository {
  create(user: User, quiz: Quiz): QuizResult;
  save(quizResult: QuizResult): Promise<void>;
  findByQuizAndUserId(
    quizId: string,
    userId: string,
  ): Promise<QuizResult | null>;
}
