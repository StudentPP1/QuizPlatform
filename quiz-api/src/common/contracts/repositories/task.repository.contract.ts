import { CreateTaskDto } from '@common/dto/create-task.dto';
import { UpdateTaskDto } from '@common/dto/update-task.dto';
import { Quiz } from '@database/entities/quiz.entity';
import { Task } from '@database/entities/task.entity';

export interface ITaskRepository {
  create(taskDto: CreateTaskDto | UpdateTaskDto, quiz: Quiz): Task;
  save(tasks: Task): Promise<void>;
  findByQuizId(quizId: string): Promise<Task[]>;
  remove(tasks: Task[]): Promise<void>;
}
