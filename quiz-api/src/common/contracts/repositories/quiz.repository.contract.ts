import { CreateQuizDto } from '@common/dto/create-quiz.dto';
import { Quiz } from '@database/entities/quiz.entity';
import { User } from '@database/entities/user.entity';

export interface IQuizRepository {
  findOneByIdWithRelations(
    id: string,
    relations?: string[],
  ): Promise<Quiz | null>;
  create(createQuizDto: CreateQuizDto, creator: User): Quiz;
  save(quiz: Quiz): Promise<void>;
  remove(quiz: Quiz): Promise<void>;
  findByName(name: string, from: number, to: number): Promise<Quiz[]>;
  findTopQuizzes(limit: number): Promise<Quiz[]>;
  findCreatedByUserId(
    userId: string,
    from: number,
    to: number,
  ): Promise<Quiz[]>;
  findParticipatedByUserId(
    userId: string,
    from: number,
    to: number,
  ): Promise<Quiz[]>;
}
