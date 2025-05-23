import { QuizCreatedResult } from "../../models/QuizCreatedResult";
import { Creator } from "../../models/Creator";
import { Quiz } from "../../models/Quiz";
import { QuizDTO } from "../../models/QuizDTO";
import { Review } from "../../models/Review";
import { apiFetch } from "../utils/ApiUtils";
import { RequestAttributes } from "../utils/RequestAttributes";
import { DoneApiResult } from "../../models/DoneApiResult";
import { log } from "../../utils/Logger";
import { HttpMethod } from "../utils/HttpMethod";

export class QuizService {
  @log
  static async getTopQuizzes(limit: number = 3): Promise<QuizDTO[]> {
    return apiFetch<QuizDTO[]>(
      `/api/quiz/top-rated?limit=${limit}`,
      this.withAuth()
    );
  }

  @log
  static async getTopAuthors(limit: number = 3): Promise<Creator[]> {
    return apiFetch<Creator[]>(
      `/api/users/top-creators?limit=${limit}`,
      this.withAuth()
    );
  }

  @log
  static async search(text: string): Promise<QuizDTO[]> {
    return apiFetch<QuizDTO[]>(
      `/api/quiz/search?name=${text}`,
      this.withAuth()
    );
  }

  @log
  static async getQuiz(quizId: string): Promise<Quiz> {
    return apiFetch<Quiz>(
      `/api/quiz/${quizId}/info`,
      this.withAuth(),
      this.handleNotFound
    );
  }

  @log
  static async getCreatedQuizzes(from: number, to: number): Promise<QuizDTO[]> {
    return apiFetch<QuizDTO[]>(
      `/api/users/created?from=${from}&to=${to}`,
      this.withAuth()
    );
  }

  @log
  static async getParticipatedQuizzes(
    from: number,
    to: number
  ): Promise<QuizDTO[]> {
    return apiFetch<QuizDTO[]>(
      `/api/users/participated?from=${from}&to=${to}`,
      this.withAuth()
    );
  }

  @log
  static async sendReview(quizId: string, rating: number, text: string | null) {
    return apiFetch(
      `/api/review/${quizId}`,
      RequestAttributes.builder()
        .setMethod(HttpMethod.POST)
        .setBody({
          rating: rating,
          text: text,
        })
        .addAuthHeader()
        .build()
    );
  }

  @log
  static async getReviews(id: string): Promise<Review[]> {
    return apiFetch<Review[]>(`/api/review?quizId=${id}`, this.withAuth());
  }

  @log
  static async createQuiz(
    quiz: any,
    update: boolean,
    quizId?: string
  ): Promise<QuizCreatedResult> {
    return apiFetch<QuizCreatedResult>(
      `/api/quiz/${update ? `update/${quizId}` : "create"}`,
      RequestAttributes.builder()
        .setMethod(update ? HttpMethod.PUT : HttpMethod.POST)
        .setEmptyHeader()
        .setBody(quiz, false)
        .addAuthHeader()
        .build(),
      this.handleNotFound
    );
  }

  @log
  static deleteQuiz(id: string): Promise<DoneApiResult> {
    return apiFetch<QuizCreatedResult>(
      `/api/quiz/delete/${id}`,
      RequestAttributes.builder()
        .setMethod(HttpMethod.DELETE)
        .addAuthHeader()
        .build(),
      this.handleNotFound
    );
  }

  @log
  static async doneQuiz(quizId: string, score: number): Promise<DoneApiResult> {
    return apiFetch<DoneApiResult>(
      `/api/quiz/${quizId}/results`,
      RequestAttributes.builder()
        .setMethod(HttpMethod.POST)
        .setBody({
          score: score,
        })
        .addAuthHeader()
        .build()
    );
  }

  private static withAuth() {
    return RequestAttributes.builder().addAuthHeader().build();
  }

  private static handleNotFound() {
    localStorage.setItem("index", "2");
    window.location.href = "/home";
  }
}
