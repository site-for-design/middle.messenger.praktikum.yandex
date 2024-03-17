import queryString from "../helpers/queryStringify";

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

export default class HTTPTransport {
    baseUrl?: string;

    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl;
    }

    private request = <T>(url: string, options: Options): Promise<T> => {
        const {
            method,
            data,
            withCredentials = true,
            timeout = 60000,
        } = options;

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.timeout = timeout;

            let finalUrl = this.baseUrl + url;
            if (method === METHODS.GET && data) {
                finalUrl += queryString(data as Record<string, unknown>);
            }
            xhr.open(method, finalUrl);

            xhr.onload = function () {
                const status = xhr.status || 0;
                if (status >= 200 && status < 300) {
                    resolve(
                        xhr.response === "OK"
                            ? xhr.response
                            : JSON.parse(xhr.response)
                    );
                } else {
                    reject(JSON.parse(xhr.response));
                }
            };

            xhr.onabort = reject;
            xhr.onerror = reject;
            xhr.ontimeout = reject;

            xhr.withCredentials = withCredentials;

            if (method === METHODS.GET || !data) {
                xhr.send();
            } else if (data instanceof FormData) {
                xhr.send(data);
            } else {
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify(data));
            }
        });
    };
    get = <T>(url: string, options?: Omit<Options, "method">): Promise<T> => {
        return this.request(url, { ...options, method: METHODS.GET });
    };
    post = <T>(url: string, options?: Omit<Options, "method">): Promise<T> => {
        return this.request(url, { ...options, method: METHODS.POST });
    };
    put = <T>(url: string, options?: Omit<Options, "method">): Promise<T> => {
        return this.request(url, { ...options, method: METHODS.PUT });
    };
    delete = <T>(
        url: string,
        options?: Omit<Options, "method">
    ): Promise<T> => {
        return this.request(url, { ...options, method: METHODS.DELETE });
    };
}
