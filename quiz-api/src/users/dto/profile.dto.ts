import { User } from '@users/entities/user.entity';

export class ProfileDto {
  userId: string;
  username: string;
  avatarUrl?: string;
  rating: number;
  email: string;
  numberOfQuizzes: number;

  constructor(user: User) {
    this.userId = user.id;
    this.username = user.username;
    this.avatarUrl = user.avatarUrl;
    this.rating = user.rating;
    this.email = user.email;
    this.numberOfQuizzes = user.createdQuizzes.length;
  }
}
