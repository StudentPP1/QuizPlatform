import { Module } from '@nestjs/common';

import {
  TASK_REPOSITORY,
  TASK_SERVICE,
} from '@common/constants/task.constants';
import { TaskRepository } from '@task/task.repository';
import { TaskService } from '@task/task.service';

@Module({
  providers: [
    {
      provide: TASK_REPOSITORY,
      useClass: TaskRepository,
    },
    {
      provide: TASK_SERVICE,
      useClass: TaskService,
    },
  ],
  exports: [TASK_SERVICE],
})
export class TaskModule {}
