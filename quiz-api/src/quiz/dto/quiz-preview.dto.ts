import { Quiz } from '@quiz/entities/quiz.entity';
import { TaskPreviewDto } from '@task/dto/task-preview.dto';

export class QuizPreviewDto {
  id: string;
  title: string;
  description: string;
  numberOfTasks: number;
  timeLimit: number;
  rating: number;
  creator: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  tasks: TaskPreviewDto[];

  constructor(quiz: Quiz) {
    this.id = quiz.id;
    this.title = quiz.title;
    this.description = quiz.description;
    this.numberOfTasks = quiz.numberOfTasks;
    this.timeLimit = quiz.timeLimit;
    this.rating = quiz.rating;
    this.creator = {
      id: quiz.creator?.id,
      username: quiz.creator?.username,
      avatarUrl: quiz.creator?.avatarUrl,
    };
    this.tasks = quiz.tasks?.map((task) => new TaskPreviewDto(task)) || [];
  }
}
