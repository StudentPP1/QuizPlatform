import { TaskType } from '@common/enums/task-type.enum';
import { Task } from '@task/entities/task.entity';

export class TaskPreviewDto {
  id: string;
  question: string;
  type: TaskType;
  image?: string | null;
  correctAnswers: string[];
  options?: string[] | null;

  constructor(task: Task) {
    this.id = task.id;
    this.question = task.question;
    this.type = task.type;
    this.image = task.image;
    this.correctAnswers = task.correctAnswers;
    this.options = task.options;
  }
}
