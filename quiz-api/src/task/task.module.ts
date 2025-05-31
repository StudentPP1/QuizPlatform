import {
  BASE_TASK_SERVICE,
  TASK_REPOSITORY,
  TASK_SERVICE,
} from '@common/constants/task.constants';
import { Module } from '@nestjs/common';

import { ITaskService } from '@common/contracts/services/task.service.contract';
import { TaskRepository } from '@database/repositories/task.repository';
import { LoggingTaskDecorator } from '@task/logging-task.decorator';
import { TaskService } from '@task/task.service';

@Module({
  providers: [
    {
      provide: TASK_REPOSITORY,
      useClass: TaskRepository,
    },
    {
      provide: BASE_TASK_SERVICE,
      useClass: TaskService,
    },
    {
      provide: TASK_SERVICE,
      useFactory: (baseService: ITaskService) =>
        new LoggingTaskDecorator(baseService),
      inject: [BASE_TASK_SERVICE],
    },
  ],
  exports: [TASK_SERVICE],
})
export class TaskModule {}
