import { Tokens } from '@common/interfaces/tokens.payload';
import { RefreshToken } from '@token/entities/refresh-token.entity';
import { User } from '@users/entities/user.entity';

export interface ITokenService {
  generateTokens(user: User): Promise<Tokens>;
  validateRefreshTokenInDb(
    tokenHash: string,
    userId: string,
  ): Promise<RefreshToken>;
  invalidateUserRefreshToken(userId: string): Promise<void>;
  markTokenAsUsed(dbToken: RefreshToken): Promise<void>;
  removeTokenGenerator(userId: string): void;
}
