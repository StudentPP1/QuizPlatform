import { Inject, Injectable } from '@nestjs/common';

import { TASK_REPOSITORY } from '@common/constants/repository.constants';
import { IMAGE_SERVICE } from '@common/constants/service.constants';
import { ITaskRepository } from '@common/contracts/repositories/task.repository.contract';
import { IImageService } from '@common/contracts/services/image.service.contract';
import { ITaskService } from '@common/contracts/services/task.service.contract';
import { CreateTaskDto } from '@common/dto/create-task.dto';
import { UpdateTaskDto } from '@common/dto/update-task.dto';
import { Quiz } from '@database/entities/quiz.entity';
import { Task } from '@database/entities/task.entity';

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
    const tasks = createTaskDtos.map((dto) =>
      this.taskRepository.create(dto, quiz),
    );

    await Promise.all(tasks.map((task) => this.taskRepository.insert(task)));
  }

  async updateTasks(
    quiz: Quiz,
    updateTaskDtos: UpdateTaskDto[],
  ): Promise<Task[]> {
    const existingTasks = await this.taskRepository.findByQuizId(quiz.id);

    await this.imageService.deleteImagesFromTasks(existingTasks);

    const updatedTasks: Task[] = [];

    for (let i = 0; i < updateTaskDtos.length; i++) {
      const dto = updateTaskDtos[i];
      const task = existingTasks[i];
      if (task) {
        Object.assign(task, dto);
        task.quiz = quiz;
        await this.taskRepository.save(task);
        updatedTasks.push(task);
      } else {
        const newTask = this.taskRepository.create(dto, quiz);
        await this.taskRepository.insert(newTask);
        updatedTasks.push(newTask);
      }
    }

    if (existingTasks.length > updateTaskDtos.length) {
      const toDelete = existingTasks.slice(updateTaskDtos.length);
      await this.taskRepository.remove(toDelete);
    }

    return updatedTasks;
  }
}
