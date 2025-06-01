import { Inject, Injectable } from '@nestjs/common';

import { TASK_REPOSITORY } from '@common/constants/repository.constants';
import { IMAGE_SERVICE } from '@common/constants/service.constants';
import { ITaskRepository } from '@common/contracts/repositories/task.repository.contract';
import { IImageService } from '@common/contracts/services/image.service.contract';
import { ITaskService } from '@common/contracts/services/task.service.contract';
import { CreateTaskDto } from '@common/dto/create-task.dto';
import { UpdateTaskDto } from '@common/dto/update-task.dto';
import { Quiz } from '@database/entities/quiz.entity';

@Injectable()
export class TaskService implements ITaskService {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepository,
    @Inject(IMAGE_SERVICE) private readonly imageService: IImageService,
  ) {}

  async createTasks(
    createTaskDtos: CreateTaskDto[],
    quiz: Quiz,
  ): Promise<void> {
    for (const taskDto of createTaskDtos) {
      const task = this.taskRepository.create(taskDto, quiz);
      await this.taskRepository.save(task);
    }
  }

  async updateTasks(
    quiz: Quiz,
    updateTaskDtos: UpdateTaskDto[],
  ): Promise<void> {
    const existingTasks = await this.taskRepository.findByQuizId(quiz.id);

    await this.imageService.deleteImagesFromTasks(existingTasks);

    for (let i = 0; i < updateTaskDtos.length; i++) {
      const dto = updateTaskDtos[i];
      const task = existingTasks[i];
      if (task) {
        Object.assign(task, dto);
        task.quiz = quiz;

        await this.taskRepository.save(task);
      } else {
        const newTask = this.taskRepository.create(dto, quiz);
        await this.taskRepository.save(newTask);
      }
    }
    if (existingTasks.length > updateTaskDtos.length) {
      const toDelete = existingTasks.slice(updateTaskDtos.length);
      await this.taskRepository.remove(toDelete);
    }
  }
}
