import { Creator } from "../../models/Creator";
import { log } from "../../utils/Logger";
import { apiFetch } from "../utils/ApiUtils";
import { RequestAttributes } from "../utils/RequestAttributes";

export class UserService {
  @log
  static async getUser(): Promise<Creator> {
    return apiFetch<Creator>(
      "/api/users/profile",
      RequestAttributes.builder().addAuthHeader().build()
    );
  }

  @log
  static async getAuthor(id: string): Promise<Creator> {
    return apiFetch<Creator>(
      `/api/users/profile?id=${id}`,
      RequestAttributes.builder().addAuthHeader().build()
    );
  }
}