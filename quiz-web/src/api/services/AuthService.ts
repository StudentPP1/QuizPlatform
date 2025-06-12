import { API_BASE_URL } from "../../constants/constants";
import { log } from "../../utils/Logger";
import { apiFetch } from "../utils/ApiUtils";
import { HttpMethod } from "../utils/HttpMethod";
import { RequestAttributes } from "../utils/RequestAttributes";

// hashing with Web Crypto API
async function hashPasswordSHA(
  password: string,
  algorithm: "SHA-256" | "SHA-512" = "SHA-256"
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

// TODO: + Task 9 => implement logging using custom decorator
export class AuthService {
  @log
  static async register(username: string, email: string, password: string) {
    const hashedPassword = await hashPasswordSHA(password);

    return apiFetch(
      "/api/auth/signup",
      RequestAttributes.builder()
        .setMethod(HttpMethod.POST)
        .setBody({
          username: username,
          email: email,
          password: hashedPassword,
        })
        .build()
    );
  }

  @log
  static async login(email: string, password: string) {
    const hashedPassword = await hashPasswordSHA(password);

    return apiFetch(
      "/api/auth/login",
      RequestAttributes.builder()
        .setMethod(HttpMethod.POST)
        .setBody({
          email: email,
          password: hashedPassword
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
