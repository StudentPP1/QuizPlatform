import { Inject } from '@nestjs/common';
import { DataSource, ILike, MoreThan, Repository } from 'typeorm';

import { IQuizRepository } from '@common/contracts/repositories/quiz.repository.contract';
import { CreateQuizDto } from '@common/dto/create-quiz.dto';
import { Quiz } from '@database/entities/quiz.entity';
import { User } from '@database/entities/user.entity';
import { DATA_SOURCE } from '@common/constants/repository.constants';

export class QuizRepository implements IQuizRepository {
  private readonly repository: Repository<Quiz>;

  constructor(@Inject(DATA_SOURCE) private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Quiz);
  }

  findOneByIdWithRelations(
    id: string,
    relations: string[] = [],
  ): Promise<Quiz | null> {
    return this.repository.findOne({ where: { id }, relations });
  }

  create(createQuizDto: CreateQuizDto, creator: User): Quiz {
    const quiz = this.repository.create({ ...createQuizDto, creator });
    return quiz;
  }

  async save(quiz: Quiz): Promise<void> {
    await this.repository.save(quiz);
  }

  async remove(quiz: Quiz): Promise<void> {
    await this.repository.remove(quiz);
  }

  findByName(name: string, from: number, to: number): Promise<Quiz[]> {
    return this.repository.find({
      where: { title: ILike(`%${name}%`) },
      relations: ['tasks', 'creator', 'creator.createdQuizzes'],
      skip: from - 1,
      take: to - from,
    });
  }

  findTopQuizzes(limit: number): Promise<Quiz[]> {
    return this.repository.find({
      where: { rating: MoreThan(0) },
      relations: ['tasks', 'creator', 'creator.createdQuizzes'],
      order: { rating: 'DESC' },
      take: limit,
    });
  }

  findCreatedByUserId(
    userId: string,
    from: number,
    to: number,
  ): Promise<Quiz[]> {
    return this.repository.find({
      where: { creator: { id: userId } },
      relations: ['tasks', 'creator', 'creator.createdQuizzes'],
      skip: from - 1,
      take: to - from,
    });
  }

  findParticipatedByUserId(
    userId: string,
    from: number,
    to: number,
  ): Promise<Quiz[]> {
    return this.repository.find({
      where: { participants: { id: userId } },
      relations: ['tasks', 'participants', 'creator', 'creator.createdQuizzes'],
      skip: from - 1,
      take: to - from,
    });
  }
}
