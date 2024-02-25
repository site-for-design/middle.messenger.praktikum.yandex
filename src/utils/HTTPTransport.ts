enum METHODS {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

type Options = { method: METHODS; data?: string };

const convertToParamsUrl = (data = {}) => {
    return Object.keys(data).reduce((acc, key, index) => {
        return acc + (index === 0 ? "?" : "&") + `${key}=${data[key]}`;
    }, "");
};

function queryStringify(data) {
    return data ? JSON.stringify(data) : "";
}

export default class HTTPTransport {
    request(url: string, options: Options, timeout: number = 2000) {
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
    }

    get = (url: string, options: Options, timeout: number) => {
        // return this.request(url, {...options, method: METHODS.GET});
        return this.request(url, { ...options, method: METHODS.GET }, timeout);
    };
    post = (url: string, options: Options, timeout: number) => {
        // return this.request(url, {...options, method: METHODS.GET});
        return this.request(url, { ...options, method: METHODS.POST }, timeout);
    };
    put = (url: string, options: Options, timeout: number) => {
        // return this.request(url, {...options, method: METHODS.GET});
        return this.request(url, { ...options, method: METHODS.PUT }, timeout);
    };
    delete = (url: string, options: Options, timeout: number) => {
        // return this.request(url, {...options, method: METHODS.GET});
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
                    console.log(e);

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
