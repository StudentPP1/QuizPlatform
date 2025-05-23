import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { IQuizResultRepository } from '@common/contracts/repositories/quiz-result.repository.contract';
import { SaveQuizResultDto } from '@common/dto/save-quiz-result.dto';
import { QuizResult } from '@quiz/entities/quiz-result.entity';
import { Quiz } from '@quiz/entities/quiz.entity';
import { User } from '@users/entities/user.entity';

@Injectable()
export class QuizResultRepository implements IQuizResultRepository {
  private readonly repository: Repository<QuizResult>;

  constructor(@Inject(DataSource) private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(QuizResult);
  }

  create(dto: SaveQuizResultDto, user: User, quiz: Quiz): QuizResult {
    const quizResult = this.repository.create({
      user,
      quiz,
      ...dto,
    });

    return quizResult;
  }

  async save(quizResult: QuizResult): Promise<void> {
    await this.repository.save(quizResult);
  }
}
