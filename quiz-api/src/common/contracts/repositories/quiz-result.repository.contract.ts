import { SaveQuizResultDto } from '@common/dto/save-quiz-result.dto';
import { QuizResult } from '@quiz/entities/quiz-result.entity';
import { Quiz } from '@quiz/entities/quiz.entity';
import { User } from '@users/entities/user.entity';

export interface IQuizResultRepository {
  create(dto: SaveQuizResultDto, user: User, quiz: Quiz): QuizResult;
  save(quizResult: QuizResult): Promise<void>;
}
