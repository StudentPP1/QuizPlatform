import { Creator } from "../../models/Creator";
import { Quiz } from "../../models/Quiz";
import { Review } from "../../models/Review";
import { apiFetch } from "../utils/ApiUtils";
import { RequestAttributes } from "../utils/RequestAttributes";

export class QuizService {
  // TODO: Task 9 implement logging using custom decorator => @log(level="INFO")
  static getTopQuizzes = async (): Promise<Quiz[]> => {
    return apiFetch(
      "/api/quiz/top-rated",
      RequestAttributes.builder().addAuthHeader().build()
    );
  };

  static getTopAuthors = async (): Promise<Creator[]> => {
    return apiFetch(
      "/api/quiz/top-creators",
      RequestAttributes.builder().addAuthHeader().build()
    );
  };

  static search = async (text: string): Promise<Quiz[]> => {
    return apiFetch(
      `/api/quiz/search?name=${text}`,
      RequestAttributes.builder().addAuthHeader().build()
    );
  };

  static getQuiz = async (id: string): Promise<Quiz> => {
    return apiFetch(
      `/api/quiz?quizId=${id}`,
      RequestAttributes.builder().addAuthHeader().build()
    );
  };

  static getReviews = async (id: string): Promise<Review[]> => {
    return apiFetch(
      `/api/review/quiz?quizId=${id}`,
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

  static async createQuiz(quiz: any) {
    return apiFetch(
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
