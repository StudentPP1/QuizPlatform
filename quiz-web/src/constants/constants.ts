export const API_BASE_URL = `${import.meta.env.API_BASE_URL}`;
export const ACCESS_TOKEN_NAME = "access_token";

const DEFAULT_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};
const DEFAULT_CREDENTIALS: RequestCredentials = "include";

export class RequestAttributes {
  private method: string = "GET";
  private headers: Record<string, string> = DEFAULT_HEADERS;
  private credentials: RequestCredentials = DEFAULT_CREDENTIALS;
  private body?: string = undefined;

  static builder(): RequestAttributes {
    return new RequestAttributes();
  }

  setMethod(method: string): this {
    this.method = method;
    return this;
  }

  defaultHeader() {
    this.headers = {};
    return this;
  }

  addHeader(key: string, value: string): this {
    if (!this.headers) {
      this.headers = {};
    }
    this.headers[key] = value;
    return this;
  }

  setBody(data: any): this {
    this.body = data;
    return this;
  }

  build = () => {
    return {
      method: this.method,
      headers: this.headers,
      credentials: this.credentials,
      body: this.body,
    };
  };
}
