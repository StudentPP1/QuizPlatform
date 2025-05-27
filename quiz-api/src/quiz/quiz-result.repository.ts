import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { IQuizResultRepository } from '@common/contracts/repositories/quiz-result.repository.contract';
import { QuizResult } from '@quiz/entities/quiz-result.entity';
import { Quiz } from '@quiz/entities/quiz.entity';
import { User } from '@users/entities/user.entity';

@Injectable()
export class QuizResultRepository implements IQuizResultRepository {
  private readonly repository: Repository<QuizResult>;

  constructor(@Inject(DataSource) private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(QuizResult);
  }

  create(user: User, quiz: Quiz): QuizResult {
    const quizResult = this.repository.create({
      user,
      quiz,
    });

    return quizResult;
  }

  async save(quizResult: QuizResult): Promise<void> {
    await this.repository.save(quizResult);
  }

  findByQuizAndUserId(
    quizId: string,
    userId: string,
  ): Promise<QuizResult | null> {
    return this.repository.findOne({
      where: { quiz: { id: quizId }, user: { id: userId } },
    });
  }
}
