import { API_BASE_URL } from "../../constants/constants";
import { fetch } from "../utils/ApiUtils";
import { RequestAttributes } from "../utils/RequestAttributes";

export class AuthService {
  static async register(username: string, email: string, password: string) {
    return fetch(
      "/api/auth/signup",
      RequestAttributes.builder()
        .setMethod("POST")
        .setBody({
          username: username,
          email: email,
          password: password,
        })
        .build()
    );
  }

  static async login(email: string, password: string) {
    return fetch(
      "/api/auth/login",
      RequestAttributes.builder()
        .setMethod("POST")
        .setBody({
          email: email,
          password: password,
        })
        .build()
    );
  }

  static async google() {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  }

  static async logout() {
    return fetch(
      "/api/auth/login",
      RequestAttributes.builder().addAuthHeader().build()
    );
  }
}
