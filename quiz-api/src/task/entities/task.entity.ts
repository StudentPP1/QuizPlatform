import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Quiz } from '../../quiz/entities/quiz.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  question: string;

  @Column({ type: 'enum', enum: ['text', 'single', 'multiple-choice'] })
  type: 'text' | 'single' | 'multiple-choice';

  @Column('json', { nullable: true })
  correctAnswer?: string[];

  @Column({ type: 'json', nullable: true })
  options?: string[];

  @ManyToOne(() => Quiz, (quiz) => quiz.id)
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
