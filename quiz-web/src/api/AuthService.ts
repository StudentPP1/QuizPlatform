import { API_BASE_URL } from "../constants/constants";
import { RequestAttributes } from "../utils/ApiUtils";

export class AuthService {
  static async register(username: string, email: string, password: string) {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/signup`,
      RequestAttributes.builder()
        .setMethod("POST")
        .setBody({
          username: username,
          email: email,
          password: password,
        })
        .build()
    );
    const json = await response.json();
    return json;
  }

  static async login(email: string, password: string) {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/login`,
      RequestAttributes.builder()
        .setMethod("POST")
        .setBody({
          email: email,
          password: password,
        })
        .build()
    );
    const json = await response.json();
    return json;
  }

  static async google() {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  }
}
