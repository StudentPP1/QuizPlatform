import { Inject, Injectable } from '@nestjs/common';
import { DataSource, FindOptionsWhere, MoreThan, Repository } from 'typeorm';

import { IRefreshTokenRepository } from '@common/contracts/repositories/refresh-token.repository.contract';
import { RefreshToken } from '@database/entities/refresh-token.entity';
import { User } from '@database/entities/user.entity';
import { DATA_SOURCE } from '@common/constants/repository.constants';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  private readonly repository: Repository<RefreshToken>;

  constructor(@Inject(DATA_SOURCE) private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(RefreshToken);
  }

  findRefreshToken(
    userId: string,
    hash?: string,
  ): Promise<RefreshToken | null> {
    const where: FindOptionsWhere<RefreshToken> = {
      user: { id: userId },
      isUsed: false,
      expiresAt: MoreThan(new Date()),
    };

    if (hash !== undefined) {
      where.tokenHash = hash;
    }

    return this.repository.findOne({
      where,
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
