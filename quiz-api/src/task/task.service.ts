import { promises as fs } from 'fs';
import { join } from 'path';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from '@common/dto/create-task.dto';
import { UpdateTaskDto } from '@common/dto/update-task.dto';
import { Repository } from 'typeorm';

import { Quiz } from '@quiz/entities/quiz.entity';
import { Task } from '@task/entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async createTasks(createTaskDtos: CreateTaskDto[], quiz: Quiz) {
    const taskEntities = createTaskDtos.map((taskDto) => {
      const task = this.taskRepository.create({
        ...taskDto,
        quiz,
      });
      return task;
    });

    await this.taskRepository.save(taskEntities);
  }

  async updateTasks(quiz: Quiz, updateTaskDtos: UpdateTaskDto[]) {
    const existingTasks = await this.taskRepository.find({
      where: { quiz: { id: quiz.id } },
    });

    for (let i = 0; i < updateTaskDtos.length; i++) {
      const dto = updateTaskDtos[i];
      const task = existingTasks[i];
      if (task) {
        Object.assign(task, dto);
        await this.taskRepository.save(task);
      } else {
        const newTask = this.taskRepository.create({ ...dto, quiz });
        await this.taskRepository.save(newTask);
      }
    }

    if (existingTasks.length > updateTaskDtos.length) {
      const toDelete = existingTasks.slice(updateTaskDtos.length);
      await this.taskRepository.remove(toDelete);
    }
  }

  async deleteTasks(tasks: Task[]) {
    for (const task of tasks) {
      const imagePath = join(process.cwd(), task.image);
      try {
        await fs.unlink(imagePath);
        console.log(`Deleted: ${imagePath}`);
      } catch (err) {
        console.error(`Failed to delete image: ${imagePath}`, err.message);
      }
    }
  }
}
