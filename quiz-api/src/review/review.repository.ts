import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { IReviewRepository } from '@common/contracts/repositories/review.repository.contract';
import { CreateReviewDto } from '@common/dto/create-review.dto';
import { Quiz } from '@quiz/entities/quiz.entity';
import { Review } from '@review/entities/review.entity';
import { User } from '@users/entities/user.entity';

@Injectable()
export class ReviewRepository implements IReviewRepository {
  private readonly repository: Repository<Review>;

  constructor(@Inject(DataSource) private readonly dataSource: DataSource) {
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

  findByQuizId(quizId: string): Promise<Review[]> {
    return this.repository.find({
      where: { quiz: { id: quizId } },
      relations: ['user', 'user.createdQuizzes'],
    });
  }

  findByQuizCreatorId(userId: string): Promise<Review[]> {
    return this.repository.find({
      where: { quiz: { creator: { id: userId } } },
    });
  }
}
