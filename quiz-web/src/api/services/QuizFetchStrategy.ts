import { QuizDTO } from "../../models/QuizDTO";
import { QuizService } from "./QuizService";

export interface QuizFetchStrategy {
  fetchQuizzes(from: number, to: number): Promise<QuizDTO[]>;
}

export class CreatedQuizzesStrategy implements QuizFetchStrategy {
  fetchQuizzes(from: number, to: number): Promise<QuizDTO[]> {
    return QuizService.getCreatedQuizzes(from, to);
  }
}

export class ParticipatedQuizzesStrategy implements QuizFetchStrategy {
  fetchQuizzes(from: number, to: number): Promise<QuizDTO[]> {
    return QuizService.getParticipatedQuizzes(from, to);
  }
}
