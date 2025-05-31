import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Quiz } from '@database/entities/quiz.entity';
import { User } from '@database/entities/user.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Quiz, (quiz) => quiz.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;

  @Column({ type: 'int', default: 0 })
  rating: number;

  @Column({ type: 'text', nullable: true })
  text?: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
