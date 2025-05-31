import { CreateTaskDto } from '@common/dto/create-task.dto';
import { UpdateTaskDto } from '@common/dto/update-task.dto';
import { Quiz } from '@database/entities/quiz.entity';

export interface ITaskService {
  createTasks(createTaskDtos: CreateTaskDto[], quiz: Quiz): Promise<void>;
  updateTasks(quiz: Quiz, updateTaskDtos: UpdateTaskDto[]): Promise<void>;
}
