import { Creator } from "../../models/Creator";
import { Quiz } from "../../models/Quiz";
import { QuizDTO } from "../../models/QuizDTO";
import { Review } from "../../models/Review";
import { apiFetch } from "../utils/ApiUtils";
import { RequestAttributes } from "../utils/RequestAttributes";

export class QuizService {
  static getTopQuizzes = async (): Promise<Quiz[]> => {
    return apiFetch<Quiz[]>("/api/quiz/top-rated", this.withAuth());
  };

  static getTopAuthors = async (): Promise<Creator[]> => {
    return apiFetch<Creator[]>("/api/quiz/top-creators", this.withAuth());
  };

  static search = async (text: string): Promise<Quiz[]> => {
    return apiFetch<Quiz[]>(`/api/quiz/search?name=${text}`, this.withAuth());
  };

  static getQuiz = async (id: string): Promise<Quiz> => {
    return apiFetch<Quiz>(`/api/quiz?quizId=${id}`, this.withAuth());
  };

  static getCreatedQuizzes = async (
    userId: string,
    from: number,
    to: number
  ): Promise<QuizDTO[]> => {
    return apiFetch<QuizDTO[]>(
      `/api/createdQuizzes?userId=${userId}&from=${from}&to=${to}`,
      this.withAuth()
    );
  };

  static getParticipatedQuizzes = async (
    userId: string,
    from: number,
    to: number
  ): Promise<QuizDTO[]> => {
    return apiFetch<QuizDTO[]>(
      `/api/participatedQuizzes?from=${from}&to=${to}`,
      this.withAuth()
    );
  };

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

  static getReviews = async (id: string): Promise<Review[]> => {
    return apiFetch<Review[]>(`/api/review/quiz?quizId=${id}`, this.withAuth());
  };

  static async createQuiz(quiz: any): Promise<Quiz> {
    return apiFetch<Quiz>(
      "/api/quiz/create",
      RequestAttributes.builder()
        .setMethod("POST")
        .setBody(quiz)
        .addAuthHeader()
        .build()
    );
  }

  static async doneQuiz(quizId: string, score: number) {
    return apiFetch(
      `/api/quiz/${quizId}/results`,
      RequestAttributes.builder()
        .setMethod("POST")
        .setBody({
          score: score,
          passed: true,
        })
        .addAuthHeader()
        .build()
    );
  }
  private static withAuth() {
    return RequestAttributes.builder().addAuthHeader().build();
  }
}
