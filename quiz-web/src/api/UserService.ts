import { Creator } from "../models/Creator";

export class UserService {
  static getUser = async(id: string | null): Promise<Creator> => {
    const url = "http://localhost:3000/api/users" + id ? `?userId=${id}` : ""
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:5137",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
      credentials: "include",
    });
    const json = await response.json();
    return json;
  }
}
