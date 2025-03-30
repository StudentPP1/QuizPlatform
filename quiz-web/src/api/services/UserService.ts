import { Creator } from "../../models/Creator";
import { fetch } from "../utils/ApiUtils";
import { RequestAttributes } from "../utils/RequestAttributes";

export class UserService {
  static getUser = async (): Promise<Creator> => {
    return fetch(
      "/api/users",
      RequestAttributes.builder().addAuthHeader().build()
    );
  };

  static getAuthor = async (id: string): Promise<Creator> => {
    return fetch(
      `/api/users?userId=${id}`,
      RequestAttributes.builder().addAuthHeader().build()
    );
  };
}