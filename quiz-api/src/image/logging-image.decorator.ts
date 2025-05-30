import { IImageService } from '@common/contracts/services/image.service.contract';
import { baseLogger } from '@common/logging/logger';
import { Task } from '@task/entities/task.entity';

export class LoggingImageDecorator implements IImageService {
  private readonly logger = baseLogger.child({ service: 'Image Service' });

  constructor(private readonly wrapped: IImageService) {}

  private async logMethod<T>(
    methodName: string,
    args: unknown[],
    fn: () => Promise<T>,
  ): Promise<T> {
    this.logger.info(
      `Called ${methodName}(${args.map((arg) => JSON.stringify(arg)).join(', ')})`,
    );
    const start = Date.now();

    try {
      const result = await fn();
      const duration = Date.now() - start;
      this.logger.info(`Method ${methodName} completed in ${duration}ms`);
      return result;
    } catch (error) {
      this.logger.error(
        `Method ${methodName} failed: ${error instanceof Error ? error.message : error}`,
      );
      throw error;
    }
  }

  attachImagesToTasks<T extends Partial<Task>>(
    tasks: T[],
    files: Express.Multer.File[],
  ): Promise<T[]> {
    return this.logMethod(this.attachImagesToTasks.name, [tasks], () =>
      this.wrapped.attachImagesToTasks(tasks, files),
    );
  }

  deleteImagesFromTasks(tasks: Task[]): Promise<void> {
    return this.logMethod(this.deleteImagesFromTasks.name, [tasks], () =>
      this.wrapped.deleteImagesFromTasks(tasks),
    );
  }
}
