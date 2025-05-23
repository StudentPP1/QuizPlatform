import { Inject, Injectable } from '@nestjs/common';
import { DataSource, MoreThan, Repository } from 'typeorm';

import { IUsersRepository } from '@common/contracts/repositories/users.repository.contract';
import { User } from '@users/entities/user.entity';

@Injectable()
export class UsersRepository implements IUsersRepository {
  private readonly repository: Repository<User>;

  constructor(@Inject(DataSource) private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(User);
  }

  findOneById(id: string): Promise<User | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['createdQuizzes', 'participatedQuizzes'],
    });
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }

  create(data: Partial<User>): User {
    const user = this.repository.create(data);
    return user;
  }

  async save(user: User): Promise<void> {
    await this.repository.save(user);
  }

  findTopCreators(limit: number): Promise<User[]> {
    return this.repository.find({
      where: { rating: MoreThan(0) },
      relations: ['createdQuizzes'],
      order: { rating: 'DESC' },
      take: limit,
    });
  }
}
