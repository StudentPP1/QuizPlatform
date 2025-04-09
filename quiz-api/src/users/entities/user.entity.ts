import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { QuizResult } from '@quiz/entities/quiz-result.entity';
import { Quiz } from '@quiz/entities/quiz.entity';
import { Review } from '@review/entities/review.entity';
import { AuthProvider } from '@users/enum/auth-provider.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  googleId?: string;

  @Column({ type: 'enum', enum: AuthProvider })
  authProvider: AuthProvider;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatarUrl?: string;

  @OneToMany(() => Quiz, (quiz) => quiz.creator)
  createdQuizzes: Quiz[];

  @ManyToMany(() => Quiz, (quiz) => quiz.participants)
  @JoinTable()
  participatedQuizzes: Quiz[];

  @OneToMany(() => QuizResult, (quizResult) => quizResult.user)
  quizResults: QuizResult[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @Column({ type: 'int', default: 0 })
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
