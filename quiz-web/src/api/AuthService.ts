import { API_BASE_URL } from "../constants/constants";
import { RequestAttributes } from "../utils/ApiUtils";
import { ApiWrapper } from "./utils/ApiWrapper";

export class AuthService {
  static async register(username: string, email: string, password: string) {
    return ApiWrapper.fetch(
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
    return ApiWrapper.fetch(
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
}
