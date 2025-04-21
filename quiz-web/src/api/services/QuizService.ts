import { CreatorDTO } from "../../models/CreatorDTO";
import { Quiz } from "../../models/Quiz";
import { apiFetch } from "../utils/ApiUtils";
import { RequestAttributes } from "../utils/RequestAttributes";
// TODO: Task 6 => 10 first quizzes from context & then load more quizzes when the user scrolls down
  
export class QuizService {
  // TODO: Task 9 implement logging using custom decorator => @log(level="INFO")
  static getTopQuizzes = async (): Promise<Quiz[]> => {
    return apiFetch(
      "/api/quiz/top-rated",
      RequestAttributes.builder().addAuthHeader().build()
    );
  };

  static getTopAuthors = async (): Promise<CreatorDTO[]> => {
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

  static getCreatedQuizzes = async (from: number, to: number): Promise<Quiz[]> => {
    return apiFetch(
      `/api/createdQuizzes?from=${from}&to=${to}`,
      RequestAttributes.builder().addAuthHeader().build()
    );
  };

  static getParticipatedQuizzes = async (from: number, to: number): Promise<Quiz[]> => {
    return apiFetch(
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
