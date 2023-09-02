import { queryStringify } from './utils/extensions';

enum METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export type TOptionsData = Record<string, string | number | Array<string | number>>;
export type TOptions = {
  headers?: Record<string, string>,
  data?: TOptionsData | FormData,
  method?: string,
  timeout?: number
};
type HTTPMethod = (url: string, options?: TOptions) => Promise<any>;
type HTTPRequest = (url: string, options?: TOptions, timeout?: number) => Promise<unknown | void>;

export default class HTTPTransport {
  baseUrl: string = '';

  withCredentials: boolean;

  constructor(baseUrl: string, withCredentials: boolean = true) {
    this.baseUrl = baseUrl;
    this.withCredentials = withCredentials;
  }

  public get: HTTPMethod = (url = '', options = {}) => (
    this.request(url, { ...options, method: METHODS.GET }, options.timeout)
  );

  public post: HTTPMethod = (url = '', options = {}) => (
    this.request(url, { ...options, method: METHODS.POST }, options.timeout)
  );

  public put: HTTPMethod = (url = '', options = {}) => (
    this.request(url, { ...options, method: METHODS.PUT }, options.timeout)
  );

  public delete: HTTPMethod = (url = '', options = {}) => (
    this.request(url, { ...options, method: METHODS.DELETE }, options.timeout)
  );

  public request: HTTPRequest = (url = '', options = {}, timeout = 5000): Promise<unknown | void> => {
    const { headers = {}, method, data } = options;

    return new Promise((resolve, reject) => {
      if (!method) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Не указан HTTP-метод');
        return;
      }

      const xhr = new XMLHttpRequest();
      const query = this.baseUrl + url;
      const fullQuery = data && method === METHODS.GET
        ? query + queryStringify(data) : query;

      xhr.open(method, fullQuery);
      xhr.withCredentials = this.withCredentials;
      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = () => {
        resolve(xhr);
      };

      xhr.onabort = reject;
      xhr.onerror = reject;

      xhr.timeout = timeout;
      xhr.ontimeout = reject;

      if (method === METHODS.GET || !data) {
        xhr.send();
      } else {
        const sendData = data instanceof FormData
          ? data : JSON.stringify(data);
        xhr.send(sendData);
      }
    });
  };
}
