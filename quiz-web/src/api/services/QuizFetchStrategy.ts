
import { QuizDTO } from "../../models/quiz/QuizDTO";
import { QuizService } from "./QuizService";

export interface QuizFetchStrategy {
  fetchQuizzes(from: number, to: number, userId?: string): Promise<QuizDTO[]>;
}

export class CreatedQuizzesStrategy implements QuizFetchStrategy {
  fetchQuizzes(from: number, to: number, userId?: string): Promise<QuizDTO[]> {
    return QuizService.getCreatedQuizzes(from, to, userId);
  }
}

export class ParticipatedQuizzesStrategy implements QuizFetchStrategy {
  fetchQuizzes(from: number, to: number): Promise<QuizDTO[]> {
    return QuizService.getParticipatedQuizzes(from, to);
  }
}
