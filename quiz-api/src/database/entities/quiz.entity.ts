import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

import { QuizResult } from '@database/entities/quiz-result.entity';
import { Review } from '@database/entities/review.entity';
import { Task } from '@database/entities/task.entity';
import { User } from '@database/entities/user.entity';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  timeLimit: number;

  @ManyToOne(() => User, (user) => user.createdQuizzes)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @OneToMany(() => Task, (task) => task.quiz, {
    onDelete: 'CASCADE',
  })
  tasks: Task[];

  @OneToMany(() => QuizResult, (quizResult) => quizResult.quiz, {
    onDelete: 'CASCADE',
  })
  results: QuizResult[];

  @ManyToMany(() => User, (user) => user.participatedQuizzes)
  @JoinTable()
  participants: User[];

  @OneToMany(() => Review, (review) => review.quiz, {
    onDelete: 'CASCADE',
  })
  reviews: Review[];

  @Column({ type: 'int', default: 0 })
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
