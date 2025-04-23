import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Quiz } from '@quiz/entities/quiz.entity';
import { CreateTaskDto } from '@task/dto/create-task.dto';
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
}
