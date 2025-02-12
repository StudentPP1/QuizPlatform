export class QuizService {
  static async getTopQuizzes() {
    const response = await fetch("http://localhost:3000/top-rated", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:5137",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
      credentials: "include"
    });
    const json = await response.json();
    return json;
  }

  static async getTopAuthors() {
    const response = await fetch("http://localhost:3000/top-creators", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:5137",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
      credentials: "include"
    });
    const json = await response.json();
    return json;
  }
}
