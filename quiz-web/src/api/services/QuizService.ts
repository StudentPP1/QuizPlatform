import { CreatorDTO } from "../../models/CreatorDTO";
import { Quiz } from "../../models/Quiz";
import { QuizDTO } from "../../models/QuizDTO";
import { Review } from "../../models/Review";
import { apiFetch } from "../utils/ApiUtils";
import { RequestAttributes } from "../utils/RequestAttributes";

export class QuizService {
  // TODO: Task 9 implement logging using custom decorator => @log(level="INFO")
  static getTopQuizzes = async (): Promise<Quiz[]> => {
    return apiFetch<Quiz[]>(
      "/api/quiz/top-rated",
      RequestAttributes.builder().addAuthHeader().build()
    );
  };

  static getTopAuthors = async (): Promise<CreatorDTO[]> => {
    return apiFetch<CreatorDTO[]>(
      "/api/quiz/top-creators",
      RequestAttributes.builder().addAuthHeader().build()
    );
  };

  static search = async (text: string): Promise<Quiz[]> => {
    return apiFetch<Quiz[]>(
      `/api/quiz/search?name=${text}`,
      RequestAttributes.builder().addAuthHeader().build()
    );
  };
  
  static getQuiz = async (id: string): Promise<Quiz> => {
    return apiFetch<Quiz>(
      `/api/quiz?quizId=${id}`,
      RequestAttributes.builder().addAuthHeader().build()
    );
  };

  static getCreatedQuizzes = async (userId: string, from: number, to: number): Promise<QuizDTO[]> => {
    return apiFetch<QuizDTO[]>(
      `/api/createdQuizzes?userId=${userId}&from=${from}&to=${to}`,
      RequestAttributes.builder().addAuthHeader().build()
    );
  };

  static getParticipatedQuizzes = async (userId: string, from: number, to: number): Promise<QuizDTO[]> => {
    return apiFetch<QuizDTO[]>(
      `/api/participatedQuizzes?from=${from}&to=${to}`,
      RequestAttributes.builder().addAuthHeader().build()
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
    return apiFetch<Review[]>(
      `/api/review/quiz?quizId=${id}`,
      RequestAttributes.builder().addAuthHeader().build()
    );
  };

  static async createQuiz(quiz: any) {
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
}
