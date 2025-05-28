import { Inject, Injectable } from '@nestjs/common';
import { DataSource, MoreThan, Repository } from 'typeorm';

import { IRefreshTokenRepository } from '@common/contracts/repositories/refresh-token.repository.contract';
import { RefreshToken } from '@token/entities/refresh-token.entity';
import { User } from '@users/entities/user.entity';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  private readonly repository: Repository<RefreshToken>;

  constructor(@Inject(DataSource) private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(RefreshToken);
  }

  findByOneByUserIdAndHash(
    hash: string,
    userId: string,
  ): Promise<RefreshToken | null> {
    return this.repository.findOne({
      where: {
        user: { id: userId },
        tokenHash: hash,
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
      relations: ['user'],
    });
  }

  create(user: User, tokenHash: string, expiresAt: Date): RefreshToken {
    return this.repository.create({ user, tokenHash, expiresAt });
  }

  async save(data: RefreshToken): Promise<void> {
    await this.repository.save(data);
  }
}
