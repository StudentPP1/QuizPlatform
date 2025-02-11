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
import { Task } from '../../task/entities/task.entity';
import { QuizResult } from './quiz-result.entity';
import { Review } from '../../review/entities/review.entity';

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
  creator: User;

  @OneToMany(() => Task, (task) => task.quiz)
  tasks: Task[];

  @OneToMany(() => QuizResult, (quizResult) => quizResult.quiz)
  results: QuizResult[];

  @ManyToMany(() => User, (user) => user.participatedQuizzes)
  @JoinTable()
  participants: User[];

  @OneToMany(() => Review, (review) => review.quiz)
  reviews: Review[];

  @Column({ type: 'float', default: 0 })
  averageRating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
