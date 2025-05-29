import { RefreshToken } from '@token/entities/refresh-token.entity';
import { User } from '@users/entities/user.entity';

export interface IRefreshTokenRepository {
  findRefreshToken(userId: string, hash?: string): Promise<RefreshToken | null>;
  create(user: User, tokenHash: string, expiresAt: Date): RefreshToken;
  save(data: RefreshToken): Promise<void>;
}
