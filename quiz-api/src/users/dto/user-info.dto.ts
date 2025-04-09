import { QuizPreviewDto } from '@quiz/dto/quiz-preview.dto';
import { User } from '@users/entities/user.entity';

export class UserInfoDto {
  userId: string;
  username: string;
  avatarUrl?: string;
  rating: number;
  email: string;
  participatedQuizzes: QuizPreviewDto[];
  createdQuizzes: QuizPreviewDto[];

  constructor(user: User) {
    this.userId = user.id;
    this.username = user.username;
    this.avatarUrl = user.avatarUrl;
    this.rating = user.rating;
    this.email = user.email;

    this.participatedQuizzes = (user.participatedQuizzes || []).map(
      (quiz) => new QuizPreviewDto(quiz),
    );

    this.createdQuizzes = (user.createdQuizzes || []).map(
      (quiz) => new QuizPreviewDto(quiz),
    );
  }
}
