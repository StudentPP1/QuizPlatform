import { Tokens } from '@common/interfaces/tokens.payload';
import { User } from '@users/entities/user.entity';

export interface ITokenService {
  generateTokens(user: User): Promise<Tokens>;
  removeTokenGenerator(userId: string): void;
}
