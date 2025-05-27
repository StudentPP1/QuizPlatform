import { CreateGoogleUserDto } from '@common/dto/create-google-user.dto';
import { CreateUserDto } from '@common/dto/create-user.dto';
import { Tokens } from '@common/interfaces/tokens.payload';
import { User } from '@users/entities/user.entity';

export interface IAuthService {
  signUp(createUserDto: CreateUserDto): Promise<Tokens>;
  login(user: User): Promise<Tokens>;
  googleLogin(user: User): Promise<Tokens>;
  validateUser(email: string, password: string): Promise<User>;
  validateGoogleUser(data: CreateGoogleUserDto): Promise<User>;
  logout(userId: string): void;
}
