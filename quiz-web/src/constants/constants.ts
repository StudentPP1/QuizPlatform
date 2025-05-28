export const DEFAULT_PAGINATION_SIZE = 10;
export const DEFAULT_PAGINATION_FROM = 1;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const FRONT_URL = `${import.meta.env.VITE_FRONT_URL}`;

export const ACCESS_TOKEN_NAME = "access_token";

export const DEFAULT_CREDENTIALS: RequestCredentials = "include";
export const DEFAULT_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": FRONT_URL,
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Headers": "*",
};