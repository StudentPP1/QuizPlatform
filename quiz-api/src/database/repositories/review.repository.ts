import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { DATA_SOURCE } from '@common/constants/repository.constants';
import { IReviewRepository } from '@common/contracts/repositories/review.repository.contract';
import { CreateReviewDto } from '@common/dto/create-review.dto';
import { Quiz } from '@database/entities/quiz.entity';
import { Review } from '@database/entities/review.entity';
import { User } from '@database/entities/user.entity';

@Injectable()
export class ReviewRepository implements IReviewRepository {
  private readonly repository: Repository<Review>;

  constructor(@Inject(DATA_SOURCE) private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Review);
  }

  create(user: User, quiz: Quiz, dto: CreateReviewDto): Review {
    const review = this.repository.create({
      quiz,
      user,
      ...dto,
    });

    return review;
  }

  async save(review: Review): Promise<void> {
    await this.repository.save(review);
  }

  findByQuizId(quizId: string, from?: number, to?: number): Promise<Review[]> {
    const skip = from != null && to != null ? from - 1 : undefined;
    const take = from != null && to != null ? to - from : undefined;

    return this.repository.find({
      where: { quiz: { id: quizId } },
      relations: ['user', 'user.createdQuizzes'],
      order: { createdAt: 'DESC' },
      skip,
      take,
    });
  }

  findByQuizCreatorId(userId: string): Promise<Review[]> {
    return this.repository.find({
      where: { quiz: { creator: { id: userId } } },
    });
  }
}
