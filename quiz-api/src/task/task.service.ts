import { promises as fs } from 'fs';
import { join } from 'path';

import { Inject, Injectable } from '@nestjs/common';

import { TASK_REPOSITORY } from '@common/constants/task.constants';
import { ITaskRepository } from '@common/contracts/repositories/task.repository.contract';
import { CreateTaskDto } from '@common/dto/create-task.dto';
import { UpdateTaskDto } from '@common/dto/update-task.dto';
import { Quiz } from '@quiz/entities/quiz.entity';
import { Task } from '@task/entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async createTasks(createTaskDtos: CreateTaskDto[], quiz: Quiz) {
    for (const taskDto of createTaskDtos) {
      const task = this.taskRepository.create(taskDto, quiz);
      await this.taskRepository.save(task);
    }
  }

  async updateTasks(quiz: Quiz, updateTaskDtos: UpdateTaskDto[]) {
    const existingTasks = await this.taskRepository.findByQuizId(quiz.id);

    for (let i = 0; i < updateTaskDtos.length; i++) {
      const dto = updateTaskDtos[i];
      const task = existingTasks[i];
      if (task) {
        Object.assign(task, dto);
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

  async deleteTasks(tasks: Task[]) {
    const tasksToDelete = tasks
      .filter((task) => task.image)
      .map(async (task) => {
        const imagePath = join(process.cwd(), task.image);
        try {
          await fs.unlink(imagePath);
          console.log(`Deleted: ${imagePath}`);
        } catch (error) {
          console.error(
            `Failed to delete image: ${imagePath}`,
            (error as Error).message,
          );
        }
      });

    await Promise.all(tasksToDelete);
  }
}
