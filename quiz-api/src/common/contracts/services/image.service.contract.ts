import { Task } from '@task/entities/task.entity';

export interface IImageService {
  attachImagesToTasks<T extends Partial<Task>>(
    tasks: T[],
    files: Express.Multer.File[],
  ): Promise<T[]>;

  deleteImagesFromTasks(tasks: Task[]): Promise<void>;
}
