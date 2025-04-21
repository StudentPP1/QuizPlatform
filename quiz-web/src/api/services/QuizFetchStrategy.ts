import { QuizDTO } from "../../models/QuizDTO";
import { QuizService } from "./QuizService";

export interface QuizFetchStrategy {
  fetchQuizzes(userId: string, from: number, to: number): Promise<QuizDTO[]>;
}

export class CreatedQuizzesStrategy implements QuizFetchStrategy {
  fetchQuizzes(userId: string, from: number, to: number): Promise<QuizDTO[]> {
    return QuizService.getCreatedQuizzes(userId, from, to);
  }
}

export class ParticipatedQuizzesStrategy implements QuizFetchStrategy {
  fetchQuizzes(userId: string, from: number, to: number): Promise<QuizDTO[]> {
    return QuizService.getParticipatedQuizzes(userId, from, to);
  }
}
