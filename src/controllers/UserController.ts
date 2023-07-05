import UserApi from '../services/UserApi';
import Block from '../core/Block';
import { TOptionsData } from '../core/HTTPTransport';
import BaseController from './BaseController';
import { RoutePath } from '../core/utils/configuration';
import FileApi from '../services/FileApi';

class UserController extends BaseController {
  public async changeData(data: TOptionsData) {
    try {
      const { status, response } = await UserApi.changeData(data);
      if (status === 200) {
        alert('Изменения в профиль внесены!');
        this.store.set({ user: JSON.parse(response) });
        this.router.go(RoutePath.User);
      } else if (status === 500) {
        this.router.go(RoutePath.Error_500);
      } else {
        alert(JSON.parse(response).reason || 'Ошибочный запрос');
      }
    } catch (e) {
      console.log(e);
    }
  }

  public async changePassword(data: TOptionsData) {
    try {
      const { status, response } = await UserApi.changePassword(data);
      if (status === 200) {
        alert('Пароль изменен!');
        this.store.set({});
        this.router.go(RoutePath.User);
      } else if (status === 500) {
        this.router.go(RoutePath.Error_500);
      } else {
        alert(JSON.parse(response).reason || 'Ошибочный запрос');
      }
    } catch (e) {
      console.log(e);
    }
  }

  public async changeAvatar(file: FormData) {
    try {
      const { status, response } = await UserApi.changeAvatar(file);
      if (status === 200) {
        alert('Аватар изменен!');
        this.store.set({ user: JSON.parse(response) });
        this.router.go(RoutePath.User);
      } else if (status === 500) {
        this.router.go(RoutePath.Error_500);
      } else {
        alert(JSON.parse(response).reason || 'Ошибочный запрос');
      }
    } catch (e) {
      console.log(e);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public getImageSrc(path: string):string {
    return FileApi.getFileSrc(path);
  }

  public async searchUsers(self: Block, value: string) {
    if (!value) {
      self.setProps({ search: value, foundUsers: null });
      return;
    }
    try {
      const { status, response } = await UserApi.searchUser(value);
      if (status === 200) {
        self.setProps({ search: value, foundUsers: JSON.parse(response) });
      } else if (status === 500) {
        this.router.go(RoutePath.Error_500);
      } else {
        alert(JSON.parse(response).reason || 'Ошибочный запрос');
      }
    } catch (e) {
      console.log(e);
    }
  }

  public async getUserIdByLogin(login: string): Promise<number | null> {
    if (!login) return null;
    try {
      const { status, response } = await UserApi.searchUser(login);
      if (status === 200) {
        const users = JSON.parse(response) as Array<any> | null;
        return users?.length === 1 ? users[0].id : null;
      }
      if (status === 500) {
        this.router.go(RoutePath.Error_500);
      } else {
        alert(JSON.parse(response).reason || 'Ошибочный запрос');
      }
    } catch (e) {
      console.log(e);
    }
    return null;
  }
}

export default new UserController();
