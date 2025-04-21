import { Quiz } from "../../models/Quiz";
import { QuizService } from "./QuizService";

export interface QuizFetchStrategy {
  fetchQuizzes(from: number, to: number): Promise<Quiz[]>;
}

export class CreatedQuizzesStrategy implements QuizFetchStrategy {
  fetchQuizzes(from: number, to: number): Promise<Quiz[]> {
    return QuizService.getCreatedQuizzes(from, to);
  }
}

export class ParticipatedQuizzesStrategy implements QuizFetchStrategy {
  fetchQuizzes(from: number, to: number): Promise<Quiz[]> {
    return QuizService.getParticipatedQuizzes(from, to);
  }
}
