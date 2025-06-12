import { CreateGoogleUserDto } from '@common/dto/create-google-user.dto';
import { CreateUserDto } from '@common/dto/create-user.dto';
import { AuthProvider } from '@common/enums/auth-provider.enum';
import { User } from '@database/entities/user.entity';

export interface IUsersRepository {
  findOneById(id: string): Promise<User | null>;
  findOneByEmail(email: string): Promise<User | null>;
  create(
    userDto: CreateUserDto | CreateGoogleUserDto,
    authProvider: AuthProvider,
  ): User;
  insert(user: User): Promise<void>;
  save(user: User): Promise<void>;
  findTopCreators(limit: number): Promise<User[]>;
}
