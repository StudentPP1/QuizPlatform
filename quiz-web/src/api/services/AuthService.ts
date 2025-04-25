import { API_BASE_URL } from "../../constants/constants";
import { log } from "../../utils/Logger";
import { apiFetch } from "../utils/ApiUtils";
import { RequestAttributes } from "../utils/RequestAttributes";

// TODO: + Task 9 => implement logging using custom decorator 
export class AuthService {
  @log
  static async register(username: string, email: string, password: string) {
    return apiFetch(
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

  @log
  static async login(email: string, password: string) {
    return apiFetch(
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

  @log
  static async google() {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  }

  @log
  static async logout() {
    return apiFetch(
      "/api/auth/logout",
      RequestAttributes.builder().addAuthHeader().build()
    );
  }
}
