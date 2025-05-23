import { Inject } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ITaskRepository } from '@common/contracts/repositories/task.repository.contract';
import { CreateTaskDto } from '@common/dto/create-task.dto';
import { Quiz } from '@quiz/entities/quiz.entity';
import { Task } from '@task/entities/task.entity';

export class TaskRepository implements ITaskRepository {
  private readonly repository: Repository<Task>;

  constructor(@Inject(DataSource) private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Task);
  }

  create(createTaskDto: CreateTaskDto, quiz: Quiz): Task {
    const task = this.repository.create({ ...createTaskDto, quiz });

    return task;
  }

  async save(task: Task): Promise<void> {
    await this.repository.save(task);
  }

  async findByQuizId(quizId: string): Promise<Task[]> {
    return this.repository.find({
      where: { quiz: { id: quizId } },
    });
  }

  async remove(tasks: Task[]): Promise<void> {
    await this.repository.remove(tasks);
  }
}
