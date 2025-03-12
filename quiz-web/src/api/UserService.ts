import { Creator } from "../models/Creator";
import { RequestAttributes } from "./utils/ApiUtils";
import { ApiWrapper } from "./utils/ApiWrapper";

export class UserService {
  static getUser = async (): Promise<Creator> => {
    return ApiWrapper.fetch(
      "/api/users",
      RequestAttributes.builder().addAuthHeader().build()
    );
  };

  static getAuthor = async (id: string): Promise<Creator> => {
    return ApiWrapper.fetch(
      `/api/users?userId=${id}`,
      RequestAttributes.builder().addAuthHeader().build()
    );
  };
}
