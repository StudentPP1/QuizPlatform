import { QuizResult } from '../../quiz/entities/quiz-result.entity';
import { Quiz } from '../../quiz/entities/quiz.entity';
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

  @Column({ type: 'varchar', length: 10 })
  authProvider: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatarUrl?: string;

  @OneToMany(() => Quiz, (quiz) => quiz.creator)
  createdQuizzes: Quiz[];

  @ManyToMany(() => Quiz, (quiz) => quiz.participants)
  @JoinTable()
  participatedQuizzes: Quiz[];

  @OneToMany(() => QuizResult, (quizResult) => quizResult.user)
  quizResults: QuizResult[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
