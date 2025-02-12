import { Creator } from "../models/Creator";

export class UserService {

  static getUser = async(): Promise<Creator> => {
    const response = await fetch("http://localhost:3000/api/users", {
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

  static getAuthor = async(id: string): Promise<Creator> => {
    const response = await fetch(
      `http://localhost:3000/api/users?userId=${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:5137",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "*",
        },
        credentials: "include",
      }
    );
    const json = await response.json();
    return json;
  }
}
