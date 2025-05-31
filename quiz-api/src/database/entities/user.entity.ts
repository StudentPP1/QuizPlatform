import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

import { AuthProvider } from '@common/enums/auth-provider.enum';
import { QuizResult } from '@database/entities/quiz-result.entity';
import { Quiz } from '@database/entities/quiz.entity';
import { Review } from '@database/entities/review.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  googleId?: string | null;

  @Column({ type: 'enum', enum: AuthProvider })
  authProvider: AuthProvider;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatarUrl?: string | null;

  @OneToMany(() => Quiz, (quiz) => quiz.creator)
  createdQuizzes: Quiz[];

  @ManyToMany(() => Quiz, (quiz) => quiz.participants)
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
