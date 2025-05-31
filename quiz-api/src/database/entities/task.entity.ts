import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

import { TaskType } from '@common/enums/task-type.enum';
import { Quiz } from '@database/entities/quiz.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  question: string;

  @Column({ type: 'enum', enum: TaskType })
  type: TaskType;

  @Column('json', { nullable: true })
  correctAnswers?: string[] | null;

  @Column({ type: 'json', nullable: true })
  options?: string[] | null;

  @ManyToOne(() => Quiz, (quiz) => quiz.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image?: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  publicId?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
