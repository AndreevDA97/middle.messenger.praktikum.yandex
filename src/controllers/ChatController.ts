import ChatApi from '../services/ChatApi';
import BaseController from './BaseController';
import { RoutePath } from '../core/utils/configuration';
import DialogController from './DialogController';
import UserController from "./UserController";

class ChatController extends BaseController {
  public async getChats(): Promise<void> {
    try {
      if (this.router?.getCurrentRoute()?.getPath() !== RoutePath.Chat) return;
      const { status, response } = await ChatApi.getChats();
      if (status === 200) {
        this.store.set({ chats: JSON.parse(response) });
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
  public getDateStr(utcStr: string): string {
    if (!utcStr) return '';
    const sourceDate = new Date(utcStr);
    const currentDate = new Date();
    if (sourceDate.getDate() === currentDate.getDate()) {
      return `${String(sourceDate.getHours()).padStart(2, '0')}:${String(sourceDate.getMinutes()).padStart(2, '0')}`;
    }
    return sourceDate.toDateString();
  }

  public async createChat(title: string): Promise<boolean | number> {
    if (!title) return false;
    try {
      const { status, response } = await ChatApi.createChat(title);
      if (status === 200) {
        const chatId = JSON.parse(response)?.id;
        await this.getChats();
        DialogController.changeCurrentChat(chatId);
        return chatId;
      } if (status === 500) {
        this.router.go(RoutePath.Error_500);
        return false;
      }
      alert(JSON.parse(response).reason || 'Ошибочный запрос');
      return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  public async addUser(login: string): Promise<boolean> {
    if (!login) return false;
    try {
      const chatId = this?.store?.getState()?.currentChat?.chat?.id;
      if (typeof chatId !== 'number') return false;
      const userId = await UserController.getUserIdByLogin(login);
      if (typeof userId !== 'number') return false;
      const { status, response } = await ChatApi.addUsers(chatId, [userId]);
      if (status === 200) {
        alert(`Пользователь ${login} успешно добавлен`);
        return true;
      } if (status === 500) {
        this.router.go(RoutePath.Error_500);
        return false;
      }
      alert(JSON.parse(response).reason || 'Ошибочный запрос');
      return false;
    } catch (e) {
      console.log(e);
    }
    return false;
  }

  public async removeUser(login: string): Promise<boolean> {
    if (!login) return false;
    try {
      const chatId = this?.store?.getState()?.currentChat?.chat?.id;
      if (typeof chatId !== 'number') return false;
      const userId = await UserController.getUserIdByLogin(login);
      if (typeof userId !== 'number') return false;
      const { status, response } = await ChatApi.removeUsers(chatId, [userId]);
      if (status === 200) {
        alert(`Пользователь ${login} успешно удален`);
        return true;
      } if (status === 500) {
        this.router.go(RoutePath.Error_500);
        return false;
      }
      alert(JSON.parse(response).reason || 'Ошибочный запрос');
      return false;
    } catch (e) {
      console.log(e);
    }
    return false;
  }

  public async deleteChat(): Promise<void> {
    try {
      const chatId = this?.store?.getState()?.currentChat?.chat?.id;
      if (typeof chatId !== 'number') return;
      const { status, response } = await ChatApi.removeChat({ chatId });
      if (status === 200) {
        alert('Текущий чат успешно удален');
        this.getChats();
        this.store.set({
          currentChat: {
            isLoading: false,
            isLoadingOldMsg: false,
            scroll: 0,
            chat: null,
            messages: null,
          },
        });
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

export default new ChatController();
