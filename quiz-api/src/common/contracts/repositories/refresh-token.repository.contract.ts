import { RefreshToken } from '@database/entities/refresh-token.entity';
import { User } from '@database/entities/user.entity';

export interface IRefreshTokenRepository {
  findRefreshToken(userId: string, hash?: string): Promise<RefreshToken | null>;
  create(user: User, tokenHash: string, expiresAt: Date): RefreshToken;
  insert(token: RefreshToken): Promise<void>;
  update(id: string, data: Partial<RefreshToken>): Promise<void>;
}
