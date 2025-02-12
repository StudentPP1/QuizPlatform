export class UserService {
    static async getUser() {
      const response = await fetch("http://localhost:3000/api/users", {
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
  