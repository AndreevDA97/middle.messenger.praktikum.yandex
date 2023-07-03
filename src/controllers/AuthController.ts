import BaseController from './BaseController';
import { TOptionsData } from '../core/HTTPTransport';
import { RoutePath } from '../core/utils/configuration';
import authApi from '../services/AuthApi';
import { getDefaultState } from '../core/Store';

class AuthController extends BaseController {
  public async register(data: TOptionsData): Promise<void> {
    try {
      this.store.set({ isLoading: true });
      const { status, response } = await authApi.register(data);
      if (status === 200) {
        this.store.set({ isAuth: true });
        this.router.go(RoutePath.Chat);
        this.getUserInfo();
        this.store.set({ isLoading: false });
      } else if (status === 500) {
        this.router.go(RoutePath.Error_500);
      } else {
        alert(JSON.parse(response).reason || 'Ошибочный запрос');
      }
    } catch (e) {
      console.log(e);
    }
  }

  public async login(data: TOptionsData): Promise<void> {
    try {
      this.store.set({ isLoading: true });
      const { status, response } = await authApi.login(data);
      if (status === 200) {
        this.store.set({ isAuth: true });
        this.router.go(RoutePath.Chat);
        this.getUserInfo();
        this.store.set({ isLoading: false });
      } else if (status === 500) {
        this.router.go(RoutePath.Error_500);
      } else {
        alert(JSON.parse(response).reason || 'Ошибочный запрос');
      }
    } catch (e) {
      console.log(e);
    }
  }

  public async getUserInfo(): Promise<boolean> {
    try {
      const { status, response } = await authApi.currentUser();
      if (status === 200 && response) {
        this.store.set({ user: JSON.parse(response) });
        this.store.set({ isAuth: true });
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  public async logout(): Promise<void> {
    try {
      const { status, response } = await authApi.logout();
      if (status === 200) {
        this.store.set(getDefaultState());
        this.router.go(RoutePath.Login);
      } else if (status === 500) {
        this.router.go(RoutePath.Error_500);
      } else {
        alert(JSON.parse(response).reason || 'Ошибочный запрос');
      }
    } catch (e) {
      console.log(e);
    }
  }
}

export default new AuthController();
