import { Quiz } from '@quiz/entities/quiz.entity';
import { TaskPreviewDto } from '@task/dto/task-preview.dto';
import { ProfileDto } from '@users/dto/profile.dto';

export class QuizPreviewDto {
  id: string;
  title: string;
  numberOfTasks: number;
  creator: ProfileDto;
  rating: number;

  constructor(quiz: Quiz) {
    this.id = quiz.id;
    this.title = quiz.title;
    this.numberOfTasks = quiz.numberOfTasks;
    this.creator = new ProfileDto(quiz.creator);
    this.rating = quiz.rating;
  }
}

export class FullQuizDto extends QuizPreviewDto {
  description: string;
  timeLimit: number;
  tasks: TaskPreviewDto[];

  constructor(quiz: Quiz) {
    super(quiz);
    this.description = quiz.description;
    this.timeLimit = quiz.timeLimit;
    this.tasks = quiz.tasks?.map((task) => new TaskPreviewDto(task)) || [];
  }
}
