import { ProfileDto } from '@common/dto/profile.dto';
import { Quiz } from '@database/entities/quiz.entity';

export class QuizPreviewDto {
  id: string;
  title: string;
  numberOfTasks: number;
  creator: ProfileDto;
  rating: number;

  constructor(quiz: Quiz) {
    this.id = quiz.id;
    this.title = quiz.title;
    this.numberOfTasks = quiz.tasks.length;
    this.creator = new ProfileDto(quiz.creator);
    this.rating = quiz.rating;
  }
}
