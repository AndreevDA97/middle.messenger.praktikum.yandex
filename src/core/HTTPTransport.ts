enum METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

type TOptionsData = Record<string, string | number>;
type TOptions = {
  headers?: Record<string, string>,
  data?: TOptionsData,
  method?: string,
  timeout?: number
};
type HTTPMethod = (url: string, options?: TOptions) => Promise<unknown>;
type HTTPRequest = (url: string, options?: TOptions, timeout?: number) => Promise<unknown | void>;

function queryStringify(data: TOptionsData): string {
  if (typeof data !== 'object') {
    throw new Error('Поле data должно быть object');
  }

  const queryParams = Object.entries(data)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return queryParams.length ? `?${queryParams}` : '';
}

export default class HTTPTransport {
  static get: HTTPMethod = (url = '', options = {}) => (
    this.request(url, { ...options, method: METHODS.GET }, options.timeout)
  );

  static post: HTTPMethod = (url = '', options = {}) => (
    this.request(url, { ...options, method: METHODS.POST }, options.timeout)
  );

  static put: HTTPMethod = (url = '', options = {}) => (
    this.request(url, { ...options, method: METHODS.PUT }, options.timeout)
  );

  static delete: HTTPMethod = (url = '', options = {}) => (
    this.request(url, { ...options, method: METHODS.DELETE }, options.timeout)
  );

  static request: HTTPRequest = (url = '', options = {}, timeout = 5000): Promise<unknown | void> => {
    const { headers = {}, method, data } = options;

    return new Promise((resolve, reject) => {
      if (!method) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Не указан HTTP-метод');
        return;
      }

      const xhr = new XMLHttpRequest();
      const fullQuery = data ? url + queryStringify(data) : url;

      xhr.open(method, fullQuery);
      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = function () {
        resolve(xhr);
      };

      xhr.onabort = reject;
      xhr.onerror = reject;

      xhr.timeout = timeout;
      xhr.ontimeout = reject;

      if (method === METHODS.GET || !data) {
        xhr.send();
      } else {
        xhr.send(JSON.stringify(data));
      }
    });
  };
}
