import {
  ACCESS_TOKEN_NAME,
  DEFAULT_CREDENTIALS,
  DEFAULT_HEADERS,
} from "../../constants/constants";
import { globalCache } from "../../hooks/useCachedFetch";
import { HttpMethod } from "./HttpMethod";

export class RequestAttributes {
  private method: string = HttpMethod.GET;
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

  addAuthHeader(): this {
    this.headers["Authorization"] = `Bearer ${
      globalCache.get(ACCESS_TOKEN_NAME)?.data
    }`;
    console.log("Authorization header: ", this.headers["Authorization"]);
    return this;
  }

  setBody(data: any, stringify: boolean = true): this {
    if (!stringify) {
      this.body = data;
    } else {
      this.body = JSON.stringify(data);
    }
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
