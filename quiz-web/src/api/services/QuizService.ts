import { QuizCreatedResult } from "../../models/QuizCreatedResult";
import { Creator } from "../../models/Creator";
import { Quiz } from "../../models/Quiz";
import { QuizDTO } from "../../models/QuizDTO";
import { Review } from "../../models/Review";
import { apiFetch } from "../utils/ApiUtils";
import { RequestAttributes } from "../utils/RequestAttributes";
import { DoneQuizResult } from "../../models/DoneQuizResult";
import { log } from "../../utils/Logger";

export class QuizService {
  @log
  static async getTopQuizzes(limit: number = 3): Promise<QuizDTO[]> {
    return apiFetch<QuizDTO[]>(`/api/quiz/top-rated?limit=${limit}`, this.withAuth());
  };

  @log
  static async getTopAuthors(limit: number = 3): Promise<Creator[]> {
    return apiFetch<Creator[]>(`/api/users/top-creators?limit=${limit}`, this.withAuth());
  };

  @log
  static async search(text: string): Promise<QuizDTO[]> {
    return apiFetch<QuizDTO[]>(`/api/quiz/search?name=${text}`, this.withAuth());
  };

  @log
  static async getQuiz(quizId: string): Promise<Quiz> {
    return apiFetch<Quiz>(`/api/quiz/${quizId}/info`, this.withAuth());
  };

  @log
  static async getCreatedQuizzes(
    userId: string,
    from: number,
    to: number
  ): Promise<QuizDTO[]> {
    return apiFetch<QuizDTO[]>(
      `/api/users/created?userId=${userId}&from=${from}&to=${to}`,
      this.withAuth()
    );
  };

  @log
  static async getParticipatedQuizzes(
    userId: string,
    from: number,
    to: number
  ): Promise<QuizDTO[]> {
    return apiFetch<QuizDTO[]>(
      `/api/users/participated?from=${from}&to=${to}`,
      this.withAuth()
    );
  };

  @log
  static async sendReview(quizId: string, rating: number, text: string | null) {
    return apiFetch(
      `/api/review/${quizId}`,
      RequestAttributes.builder()
        .setMethod("POST")
        .setBody({
          rating: rating,
          text: text,
        })
        .addAuthHeader()
        .build()
    );
  }

  @log
  static async getReviews (id: string): Promise<Review[]> {
    return apiFetch<Review[]>(`/api/review?quizId=${id}`, this.withAuth());
  };

  @log
  static async createQuiz(quiz: any): Promise<QuizCreatedResult> {
    return apiFetch<QuizCreatedResult>(
      "/api/quiz/create",
      RequestAttributes.builder()
        .setMethod("POST")
        .setBody(quiz)
        .addAuthHeader()
        .build()
    );
  }

  @log
  static async doneQuiz(quizId: string, score: number): Promise<DoneQuizResult> {
    return apiFetch<DoneQuizResult>(
      `/api/quiz/${quizId}/results`,
      RequestAttributes.builder()
        .setMethod("POST")
        .setBody({
          score: score
        })
        .addAuthHeader()
        .build()
    );
  }

  private static withAuth() {
    return RequestAttributes.builder().addAuthHeader().build();
  }
}