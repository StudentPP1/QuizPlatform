import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Quiz } from './quiz.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: ['text', 'multiple-choice'] })
  type: 'text' | 'multiple-choice';

  @Column({ type: 'text', nullable: true })
  correctAnswer?: string;

  @Column({ type: 'json', nullable: true })
  options?: string[];

  @ManyToOne(() => Quiz, (quiz) => quiz.id)
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
