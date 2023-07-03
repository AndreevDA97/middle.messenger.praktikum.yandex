import ChatApi from '../services/ChatApi';
import BaseController from './BaseController';
import { RoutePath } from '../core/utils/configuration';
import DialogController from './DialogController';

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

  public async deleteChats(): Promise<void> {
    try {
      const chatId = this?.store?.getState()?.currentChat?.chat?.id;
      if (typeof chatId !== 'number') return;
      const { status, response } = await ChatApi.deleteChat({ chatId });
      if (status === 200) {
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

  public async addUser(id: number, user: number): Promise<boolean> {
    if (!id || !user) return false;
    try {
      const { status, response } = await ChatApi.addUsers(id, [user]);
      if (status === 200) {
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

  public async addNewChatUser(user: Record<string, string | number>): Promise<boolean | void> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { display_name, login, id } = user;
    let chat = this?.store?.getState()?.currentChat?.chat?.id;
    // eslint-disable-next-line no-restricted-globals
    if (!confirm(`Вы хотите ${chat ? 'добавить в текущий чат ' : 'создать новый чат с '}${login}`)) {
      return;
    }
    if (!chat) {
      const title = display_name ?? login;
      chat = await this.createChat(String(title));
      return;
    }
    if (!chat) return;
    const result = await this.addUser(Number(chat), Number(id));
    // eslint-disable-next-line consistent-return
    return result;
  }
}

export default new ChatController();
