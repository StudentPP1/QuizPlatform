export const API_BASE_URL = `${import.meta.env.API_BASE_URL}`;
export const ACCESS_TOKEN_NAME = "access_token";

const FRONT_URL = `${import.meta.env.FRONT_URL}`;
export const DEFAULT_CREDENTIALS: RequestCredentials = "include";
export const DEFAULT_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": FRONT_URL,
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Headers": "*",
};