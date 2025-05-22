import { UpdateAuthorRatingOptions } from '@common/interfaces/update-author-rating-options.interface';
import { QuizPreviewDto } from '@quiz/dto/quiz.dto';
import { Quiz } from '@quiz/entities/quiz.entity';
import { CreateGoogleUserDto } from '@users/dto/create-google-user.dto';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { ProfileDto } from '@users/dto/profile.dto';
import { User } from '@users/entities/user.entity';
import { AuthProvider } from '@users/enum/auth-provider.enum';

export interface IUsersService {
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser<T extends CreateUserDto | CreateGoogleUserDto>(
    userDto: T,
    authProvider: AuthProvider,
  ): Promise<User>;
  getUserInfo(userId: string): Promise<ProfileDto>;
  getCreatedQuizzes(
    userId: string,
    from: number,
    to: number,
  ): Promise<QuizPreviewDto[]>;
  getParticipatedQuizzes(
    userId: string,
    from: number,
    to: number,
  ): Promise<QuizPreviewDto[]>;
  addQuizParticipation(user: User, quiz: Quiz): Promise<void>;
  getTopCreators(limit: number): Promise<ProfileDto[]>;
  updateAuthorRating(options: UpdateAuthorRatingOptions): Promise<void>;
}
