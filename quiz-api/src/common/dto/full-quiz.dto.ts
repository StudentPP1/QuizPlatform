import { QuizPreviewDto } from '@common/dto/quiz-preview.dto';
import { TaskPreviewDto } from '@common/dto/task-preview.dto';
import { Quiz } from '@database/entities/quiz.entity';

export class FullQuizDto extends QuizPreviewDto {
  description?: string | null;
  timeLimit: number;
  tasks: TaskPreviewDto[];

  constructor(quiz: Quiz) {
    super(quiz);
    this.description = quiz.description;
    this.timeLimit = quiz.timeLimit;
    this.tasks = quiz.tasks.map((task) => new TaskPreviewDto(task)) || [];
  }
}
