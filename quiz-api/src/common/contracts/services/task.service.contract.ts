import { CreateTaskDto } from '@common/dto/create-task.dto';
import { UpdateTaskDto } from '@common/dto/update-task.dto';
import { Quiz } from '@quiz/entities/quiz.entity';
import { Task } from '@task/entities/task.entity';

export interface ITaskService {
  createTasks(createTaskDtos: CreateTaskDto[], quiz: Quiz): Promise<void>;
  updateTasks(quiz: Quiz, updateTaskDtos: UpdateTaskDto[]): Promise<void>;
  deleteTasks(tasks: Task[]): Promise<void>;
}
