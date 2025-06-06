import { QuizCreatedResult } from "../../models/quiz/QuizCreatedResult";
import { Creator } from "../../models/user/Creator";
import { apiFetch } from "../utils/ApiUtils";
import { RequestAttributes } from "../utils/RequestAttributes";
import { DoneApiResult } from "../../models/common/DoneApiResult";
import { log } from "../../utils/Logger";
import { HttpMethod } from "../utils/HttpMethod";
import { QuizDTO } from "../../models/quiz/QuizDTO";
import { Quiz } from "../../models/quiz/Quiz";
import { Review } from "../../models/review/Review";

export class QuizService {
  @log
  static async getTopQuizzes(limit: number = 3): Promise<QuizDTO[]> {
    return apiFetch<QuizDTO[]>(
      `/api/quiz/top-rated?limit=${limit}`,
      QuizService.withAuth()
    );
  }

  @log
  static async getTopAuthors(limit: number = 3): Promise<Creator[]> {
    return apiFetch<Creator[]>(
      `/api/users/top-creators?limit=${limit}`,
      QuizService.withAuth()
    );
  }

  @log
  static async search(
    from: number,
    to: number,
    text: string
  ): Promise<QuizDTO[]> {
    return apiFetch<QuizDTO[]>(
      `/api/quiz/search?name=${text}&from=${from}&to=${to}`,
      QuizService.withAuth()
    );
  }

  @log
  static async getQuiz(quizId: string): Promise<Quiz> {
    return apiFetch<Quiz>(
      `/api/quiz/${quizId}/info`,
      QuizService.withAuth(),
      QuizService.handleNotFound
    );
  }

  @log
  static async getCreatedQuizzes(
    from: number,
    to: number,
    userId?: string
  ): Promise<QuizDTO[]> {
    const userIdQuery = userId ? `?userId=${userId}&` : "?";
    return apiFetch<QuizDTO[]>(
      `/api/users/created${userIdQuery}from=${from}&to=${to}`,
      QuizService.withAuth()
    );
  }

  @log
  static async getParticipatedQuizzes(
    from: number,
    to: number
  ): Promise<QuizDTO[]> {
    return apiFetch<QuizDTO[]>(
      `/api/users/participated?from=${from}&to=${to}`,
      QuizService.withAuth()
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
  static async getReviews(
    from: number,
    to: number,
    id: string
  ): Promise<Review[]> {
    return apiFetch<Review[]>(
      `/api/review?quizId=${id}&from=${from}&to=${to}`,
      QuizService.withAuth()
    );
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
      QuizService.handleNotFound
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
      QuizService.handleNotFound
    );
  }

  @log
  static async doneQuiz(quizId: string): Promise<DoneApiResult> {
    return apiFetch<DoneApiResult>(
      `/api/quiz/${quizId}/results`,
      RequestAttributes.builder()
        .setMethod(HttpMethod.POST)
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
