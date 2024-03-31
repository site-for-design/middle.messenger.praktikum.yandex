import queryString from "../helpers/queryStringify.ts";

enum METHODS {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

type Options = {
  method: METHODS;
  data?: Record<string, unknown> | FormData;
  withCredentials?: boolean;
  timeout?: number;
};
type HTTPMethod = <R = unknown>(
  url: string,
  options?: Omit<Options, "method">,
) => Promise<R>;

export default class HTTPTransport {
  baseUrl?: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl;
  }

  private request = <T>(url: string, options: Options): Promise<T> => {
    const { method, data, withCredentials = true, timeout = 60000 } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.timeout = timeout;

      const finalUrl = this.baseUrl + url;
      xhr.open(method, finalUrl);

      xhr.onload = function () {
        const status = xhr.status || 0;
        try {
          if (status >= 200 && status < 300) {
            resolve(
              xhr.response === "OK" ? xhr.response : JSON.parse(xhr.response),
            );
          } else {
            reject(JSON.parse(xhr.response));
          }
        } catch (e) {
          console.error(e);
        }
      };

      xhr.onabort = reject;
      xhr.onerror = reject;
      xhr.ontimeout = reject;

      xhr.withCredentials = withCredentials;

      if (method === METHODS.GET || !data) {
        xhr.send();
      } else if (data instanceof FormData) {
        // xhr.setRequestHeader("Content-Type", "multipart/form-data");
        xhr.send(data);
      } else {
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
      }
    });
  };

  get: HTTPMethod = (url, options = {}) => {
    const finalUrl = options.data ? url + queryString(options.data) : url;
    return this.request(finalUrl, { ...options, method: METHODS.GET });
  };

  put: HTTPMethod = (url, options = {}) =>
    this.request(url, { ...options, method: METHODS.PUT });

  post: HTTPMethod = (url, options = {}) =>
    this.request(url, { ...options, method: METHODS.POST });

  delete: HTTPMethod = (url, options = {}) =>
    this.request(url, { ...options, method: METHODS.DELETE });
}
