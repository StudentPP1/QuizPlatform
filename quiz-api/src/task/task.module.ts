import { Module } from '@nestjs/common';

import { TASK_REPOSITORY } from '@common/constants/task.constants';
import { TaskRepository } from '@task/task.repository';
import { TaskService } from '@task/task.service';

@Module({
  providers: [
    TaskService,
    {
      provide: TASK_REPOSITORY,
      useClass: TaskRepository,
    },
  ],
  exports: [TaskService],
})
export class TaskModule {}
