import HTTPTransport from '../core/HTTPTransport';
import BaseAPI from './BaseApi';
import UserApi from './UserApi';

class FileApi extends BaseAPI {
  public http = new HTTPTransport(`${this.baseUrl}/resources`);

  // eslint-disable-next-line class-methods-use-this
  public getFileSrc(path: string):string {
    return `${UserApi.baseUrl}/resources/${path}`;
  }
}

export default new FileApi();
