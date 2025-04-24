import {
  ACCESS_TOKEN_NAME,
  DEFAULT_CREDENTIALS,
  DEFAULT_HEADERS,
} from "../../constants/constants";

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

  setEmptyHeader() {
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
  
  // TODO: Task 8 => create Proxy (if error => refreshToken() => retry)
  addAuthHeader(): this {
    this.headers["Authorization"] = `Bearer ${sessionStorage.getItem(ACCESS_TOKEN_NAME)}`;
    console.log("Send header: " + this.headers["Authorization"]);
    return this;
  }

  setBody(data: any): this {
    this.body = JSON.stringify(data);
    return this;
  }

  build() {
    return {
      method: this.method,
      headers: this.headers,
      credentials: this.credentials,
      body: this.body,
    };
  }
}
