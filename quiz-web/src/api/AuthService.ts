import axios from "axios";

export class AuthService {
  static API = axios.create({
    baseURL: "https://localhost:3000",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
    },
    // headers: { "Authorization": `Bearer ${localStorage.getItem("access_token")}` },
    withCredentials: true,
  });

  public static register(username: string, email: string, password: string) {
    this.API.post("/api/auth/signup", {
      username: username,
      email: email,
      password: password,
    })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  public static login(email: string, password: string) {
    this.API.post("/api/auth/login", {
      email: email,
      password: password,
    })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  public static google() {
    console.log("google");
  }
}
