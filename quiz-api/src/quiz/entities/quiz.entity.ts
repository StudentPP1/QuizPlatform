import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Task } from './task.entity';
import { QuizResult } from './quiz-result.entity';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  numberOfTasks: number;

  @Column({ type: 'int' })
  timeLimit: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'creatorId' })
  creator: string;

  @OneToMany(() => Task, (task) => task.quiz)
  tasks: Task[];

  @OneToMany(() => QuizResult, (quizResult) => quizResult.quiz)
  results: QuizResult[];

  @ManyToMany(() => User, (user) => user.participatedQuizzes)
  @JoinTable()
  participants: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
