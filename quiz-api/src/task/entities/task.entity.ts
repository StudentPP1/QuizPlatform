import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

import { Quiz } from '@quiz/entities/quiz.entity';
import { TaskType } from '@task/enum/task-type.enum';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  question: string;

  @Column({ type: 'enum', enum: TaskType })
  type: TaskType;

  @Column('json', { nullable: true })
  correctAnswers?: string[];

  @Column({ type: 'json', nullable: true })
  options?: string[];

  @ManyToOne(() => Quiz, (quiz) => quiz.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
