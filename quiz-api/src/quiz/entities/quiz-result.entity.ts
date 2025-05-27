import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Quiz } from '@quiz/entities/quiz.entity';
import { User } from '@users/entities/user.entity';

@Entity()
export class QuizResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.quizResults)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Quiz, (quiz) => quiz.results, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
