import { ITaskService } from '@common/contracts/services/task.service.contract';
import { CreateTaskDto } from '@common/dto/create-task.dto';
import { UpdateTaskDto } from '@common/dto/update-task.dto';
import { baseLogger } from '@common/logging/logger';
import { Quiz } from '@database/entities/quiz.entity';

export class LoggingTaskDecorator implements ITaskService {
  private readonly logger = baseLogger.child({ service: 'Task Service' });

  constructor(private readonly wrapped: ITaskService) {}

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

  createTasks(createTaskDtos: CreateTaskDto[], quiz: Quiz): Promise<void> {
    return this.logMethod('createTasks', [createTaskDtos, quiz], () =>
      this.wrapped.createTasks(createTaskDtos, quiz),
    );
  }

  updateTasks(quiz: Quiz, updateTaskDtos: UpdateTaskDto[]): Promise<void> {
    return this.logMethod('updateTasks', [quiz, updateTaskDtos], () =>
      this.wrapped.updateTasks(quiz, updateTaskDtos),
    );
  }
}
