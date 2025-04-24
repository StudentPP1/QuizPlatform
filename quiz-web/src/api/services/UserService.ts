import { Creator } from "../../models/Creator";
import { apiFetch } from "../utils/ApiUtils";
import { RequestAttributes } from "../utils/RequestAttributes";

export class UserService {
  static async getUser(): Promise<Creator> {
    return apiFetch<Creator>(
      "/api/users/profile",
      RequestAttributes.builder().addAuthHeader().build()
    );
  }

  static async getAuthor(id: string): Promise<Creator> {
    return apiFetch<Creator>(
      `/api/users/profile?id=${id}`,
      RequestAttributes.builder().addAuthHeader().build()
    );
  }
}