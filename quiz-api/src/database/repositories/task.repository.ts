import { Inject } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { DATA_SOURCE } from '@common/constants/repository.constants';
import { ITaskRepository } from '@common/contracts/repositories/task.repository.contract';
import { CreateTaskDto } from '@common/dto/create-task.dto';
import { UpdateTaskDto } from '@common/dto/update-task.dto';
import { Quiz } from '@database/entities/quiz.entity';
import { Task } from '@database/entities/task.entity';

export class TaskRepository implements ITaskRepository {
  private readonly repository: Repository<Task>;

  constructor(@Inject(DATA_SOURCE) private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Task);
  }

  create(dto: CreateTaskDto | UpdateTaskDto, quiz: Quiz): Task {
    const task = this.repository.create({ ...dto, quiz });

    return task;
  }

  async save(task: Task): Promise<void> {
    await this.repository.save(task);
  }

  async findByQuizId(quizId: string): Promise<Task[]> {
    return this.repository.find({
      where: { quiz: { id: quizId } },
      relations: ['quiz'],
    });
  }

  async remove(tasks: Task[]): Promise<void> {
    await this.repository.remove(tasks);
  }
}
