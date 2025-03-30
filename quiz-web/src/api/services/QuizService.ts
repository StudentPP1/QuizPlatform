import { Creator } from "../../models/Creator";
import { Quiz } from "../../models/Quiz";
import { Review } from "../../models/Review";
import { fetch } from "../utils/ApiUtils";
import { RequestAttributes } from "../utils/RequestAttributes";

export class QuizService {
  static getTopQuizzes = async (): Promise<Quiz[]> => {
    return fetch(
      "/api/quiz/top-rated",
      RequestAttributes.builder().addAuthHeader().build()
    );
  };

  static getTopAuthors = async (): Promise<Creator[]> => {
    return fetch(
      "/api/quiz/top-creators",
      RequestAttributes.builder().addAuthHeader().build()
    );
  };

  static search = async (text: string): Promise<Quiz[]> => {
    return fetch(
      `/api/quiz/search?name=${text}`,
      RequestAttributes.builder().addAuthHeader().build()
    );
  };

  static getQuiz = async (id: string): Promise<Quiz> => {
    return fetch(
      `/api/quiz?quizId=${id}`,
      RequestAttributes.builder().addAuthHeader().build()
    );
  };

  static getReviews = async (id: string): Promise<Review[]> => {
    return fetch(
      `/api/review/quiz?quizId=${id}`,
      RequestAttributes.builder().addAuthHeader().build()
    );
  };

  static async sendReview(quizId: string, rating: number, text: string | null) {
    return fetch(
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
    return fetch(
      "/api/quiz/create",
      RequestAttributes.builder()
        .setMethod("POST")
        .setBody(quiz)
        .addAuthHeader()
        .build()
    );
  }

  static async doneQuiz(quizId: string, score: number) {
    return fetch(
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
