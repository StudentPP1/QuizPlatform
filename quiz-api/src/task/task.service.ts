import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async createTasks(createTaskDtos: CreateTaskDto[], quiz: any) {
    const taskEntities = createTaskDtos.map((taskDto) => {
      return this.taskRepository.create({
        ...taskDto,
        quiz,
      });
    });

    return await this.taskRepository.save(taskEntities);
  }
}
