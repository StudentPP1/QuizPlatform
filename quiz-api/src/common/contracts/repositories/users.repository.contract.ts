import { User } from '@users/entities/user.entity';

export interface IUsersRepository {
  findOneById(id: string): Promise<User | null>;
  findOneByEmail(email: string): Promise<User | null>;
  create(data: Partial<User>): User;
  save(user: User): Promise<void>;
  findTopCreators(limit: number): Promise<User[]>;
}
