import { CreateGoogleUserDto } from '@common/dto/create-google-user.dto';
import { CreateUserDto } from '@common/dto/create-user.dto';
import { BasePaginationDto } from '@common/dto/pagination.dto';
import { ProfileDto } from '@common/dto/profile.dto';
import { QuizPreviewDto } from '@common/dto/quiz-preview.dto';
import { AuthProvider } from '@common/enums/auth-provider.enum';
import { UpdateAuthorRatingOptions } from '@common/interfaces/update-author-rating-options.interface';
import { User } from '@database/entities/user.entity';

export interface IUsersService {
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(
    userDto: CreateUserDto | CreateGoogleUserDto,
    authProvider: AuthProvider,
  ): Promise<User>;
  getUserInfo(userId: string): Promise<ProfileDto>;
  getCreatedQuizzes(
    userId: string,
    paginationDto: BasePaginationDto,
  ): Promise<QuizPreviewDto[]>;
  getParticipatedQuizzes(
    userId: string,
    paginationDto: BasePaginationDto,
  ): Promise<QuizPreviewDto[]>;
  getTopCreators(limit: number): Promise<ProfileDto[]>;
  updateAuthorRating(options: UpdateAuthorRatingOptions): Promise<void>;
}
