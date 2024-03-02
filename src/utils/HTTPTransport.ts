enum METHODS {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

type Options = { method: METHODS; data?: Record<string, unknown> };

const convertToParamsUrl = (data: Record<string, unknown> = {}) => {
    return Object.keys(data).reduce((acc, key, index) => {
        return acc + (index === 0 ? "?" : "&") + `${key}=${data[key]}`;
    }, "");
};

function queryStringify(data?: Record<string, unknown>) {
    return data ? JSON.stringify(data) : "";
}

type HTTPMethod = (
    url: string,
    options: Options,
    timeout?: number
) => Promise<unknown>;

export default class HTTPTransport {
    request: HTTPMethod = (url, options, timeout = 2000) => {
        const { method, data } = options;

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.timeout = timeout;

            if (method === METHODS.GET && data) {
                xhr.open(method, url + convertToParamsUrl(data));
            } else {
                xhr.open(method, url);
            }

            xhr.onload = function () {
                resolve(xhr);
            };

            xhr.onabort = reject;
            xhr.onerror = reject;
            xhr.ontimeout = reject;

            if (method === METHODS.GET && data) {
                xhr.send();
            } else {
                xhr.send(queryStringify(data));
            }
        });
    };
    get: HTTPMethod = (url, options, timeout) => {
        return this.request(url, { ...options, method: METHODS.GET }, timeout);
    };
    post: HTTPMethod = (url, options, timeout) => {
        return this.request(url, { ...options, method: METHODS.POST }, timeout);
    };
    put: HTTPMethod = (url, options, timeout) => {
        return this.request(url, { ...options, method: METHODS.PUT }, timeout);
    };
    delete: HTTPMethod = (url, options, timeout) => {
        return this.request(
            url,
            { ...options, method: METHODS.DELETE },
            timeout
        );
    };
}

export function fetchWithRetry(
    url: string,
    options: Options & { retries: number },
    timeout: number
) {
    const { method, data, retries = 2 } = options;
    const fetchInstance = new HTTPTransport();
    let i = retries;

    const fetchLoop = () => {
        return fetchInstance
            .get(url, { method, data }, timeout)
            .then((res) => {
                return Promise.resolve(res);
            })
            .catch((e) => {
                i = -1;
                if (i === 0) {
                    fetchLoop();
                } else {
                    throw new Error(e);
                }
            });

        // return response;
    };
    try {
        const res = fetchLoop();
        return res;
    } catch (e) {
        return e;
    }
}
