import { Creator } from "../models/Creator";
import { Quiz } from "../models/Quiz";
import { Review } from "../models/Review";

export class QuizService {
  static getTopQuizzes = async (): Promise<Quiz[]> => {
    const response = await fetch("http://localhost:3000/api/quiz/top-rated", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:5137",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
      credentials: "include",
    });
    const json = await response.json();
    return json;
  };

  static getTopAuthors = async (): Promise<Creator[]> => {
    const response = await fetch(
      "http://localhost:3000/api/quiz/top-creators",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:5137",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "*",
        },
        credentials: "include",
      }
    );
    const json = await response.json();
    return json;
  };

  static search = async (text: string): Promise<Quiz[]> => {
    const response = await fetch(
      `http://localhost:3000/api/quiz/search?name=${text}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:5137",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "*",
        },
        credentials: "include",
      }
    );
    const json = await response.json();
    return json;
  };

  static getQuiz = async (id: string): Promise<Quiz[]> => {
    const response = await fetch(
      `http://localhost:3000/api/quiz?quizId=${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:5137",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "*",
        },
        credentials: "include",
      }
    );
    const json = await response.json();
    return json;
  };

  static getReviews = async (id: string): Promise<Review[]> => {
    const response = await fetch(
      `http://localhost:3000/api/review/quiz?quizId=${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:5137",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "*",
        },
        credentials: "include",
      }
    );
    const json = await response.json();
    return json;
  };

  static async sendReview(quizId: string, rating: number, text: string | null) {
    const response = await fetch(`http://localhost:3000/api/review/${quizId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:5137",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
      credentials: "include",
      body: JSON.stringify({
        rating: rating,
        text: text,
      }),
    });
    const json = await response.json();
    return json;
  }

  static async createQuiz(quiz: any) {
    const response = await fetch("http://localhost:3000/api/quiz/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:5137",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
      credentials: "include",
      body: JSON.stringify(quiz),
    });
    const json = await response.json();
    return json;
  }
}
