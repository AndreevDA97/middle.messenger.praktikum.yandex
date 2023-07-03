import { wssUrl } from '../core/utils/configuration';
import ChatApi from '../services/ChatApi';
import BaseController from './BaseController';

export type TWSSConnectOptions = {
  userId: number | string,
  chatId: number | string,
  token: string,
};

class MessageController extends BaseController {
  public EVENTS: Record<string, string> = {
    OPEN: 'open',
    MESSAGE: 'message',
    ERROR: 'error',
    CLOSE: 'close',
  };

  private _userId: number | string | undefined;

  private _chatId: number | string | undefined;

  private _token: string;

  private _ping: number | undefined;

  private _offset: number = 0;

  private _allMessage: boolean = false;

  public events: Record<string, Function> | {} = {};

  public baseUrl: string = wssUrl;

  public socket: WebSocket | null = null;

  constructor() {
    super();
    this._handleOpen = this._handleOpen.bind(this);
    this._handleMassage = this._handleMassage.bind(this);
    this._handleError = this._handleError.bind(this);
    this._handleClose = this._handleClose.bind(this);
  }

  public async getConnectData(): Promise<void> {
    this._userId = this.store?.getState()?.user?.id;
    this._chatId = Number(this.store?.getState()?.currentChat?.chat?.id);
    this._token = await this.getToken(this._chatId);
  }

  public async connect(): Promise<void> {
    await this.getConnectData();
    this._offset = 0;
    const url = `${this.baseUrl}/${this._userId}/${this._chatId}/${this._token}`;
    try {
      this.socket = new WebSocket(url);
      this._addEvents();
    } catch (e) {
      console.log(e);
    }
  }

  private _reconnect(): void {
    this._allMessage = false;
    this.connect();
  }

  public async disconnect(): Promise<void> {
    if (!this.socket) return;
    clearInterval(this._ping);
    this._allMessage = false;
    this._ping = undefined;
    this._offset = 0;

    this._removeEvents();
    await this.socket?.close();
    this.socket = null;
  }

  public async changeCurrentChat(id: number | undefined | string): Promise<void> {
    if (!id) return;
    const chat = this.store.getState().chats
      ?.find((c) => c.id === Number(id));
    if (chat && chat?.id !== this.store?.getState()?.currentChat?.chat?.id) {
      this.store.set({ currentChat: { isLoading: true } });
      this.store.set({ currentChat: { chat } });

      await this.disconnect();
      this.connect();
    }
  }

  private _addEvents() {
    this.socket?.addEventListener(this.EVENTS.OPEN, this._handleOpen);
    this.socket?.addEventListener(this.EVENTS.MESSAGE, this._handleMassage);
    this.socket?.addEventListener(this.EVENTS.ERROR, this._handleError);
    this.socket?.addEventListener(this.EVENTS.CLOSE, this._handleClose);
  }

  private _removeEvents() {
    this.socket?.removeEventListener(this.EVENTS.OPEN, this._handleOpen);
    this.socket?.removeEventListener(this.EVENTS.MESSAGE, this._handleMassage);
    this.socket?.removeEventListener(this.EVENTS.ERROR, this._handleError);
    this.socket?.removeEventListener(this.EVENTS.CLOSE, this._handleClose);
  }

  // eslint-disable-next-line consistent-return
  private async getToken(chatID: number) {
    try {
      const { status, response } = await ChatApi.getToken(chatID);
      if (status === 200) {
        return JSON.parse(response).token;
      } if (status === 500) {
        this.router.go('/500');
      } else {
        alert(JSON.parse(response).reason ?? 'Ошибочный запрос');
      }
    } catch (e) {
      console.log(e);
    }
  }

  private _handleOpen() {
    this.store.set({ currentChat: { messages: [] } });
    this.getMessage();
    this._ping = setInterval(() => {
      this.socket?.send(JSON.stringify({
        content: '',
        type: '',
      }));
    }, 20000);
  }

  private _handleMassage(e: MessageEvent) {
    const data = JSON.parse(e.data);
    if (Array.isArray(data) && data.length < 20) {
      this._allMessage = true;
      this.store.set({ currentChat: { isLoading: false } });
      this.store.set({ currentChat: { isLoadingOldMsg: false } });
    }
    if (Array.isArray(data) && data.length) {
      if (data[0].id === 1) {
        this.store.set({ currentChat: { messages: data } });
        this.store.set({ currentChat: { isLoading: false } });
        // activeDialog.scrollBottom();
      } else {
        const oldMessages = this.store?.getState()?.currentChat?.messages ?? [];
        this.store.set({ currentChat: { messages: [...oldMessages, ...data] } });
        this.store.set({ currentChat: { isLoadingOldMsg: false } });
      }
    } else if (typeof data === 'object' && data?.type === 'message') {
      const oldMessages = this.store?.getState()?.currentChat?.messages ?? [];
      this.store.set({ currentChat: { messages: [data, ...oldMessages] } });
      // activeDialog.scrollBottom();
      this._offset += 1;
    }
  }

  private _handleError(e: any) {
    console.log('Ошибка', e.message);
    this.disconnect();
  }

  public getMessage(): void {
    if (this._allMessage) {
      return;
    }
    if (this._offset) {
      this.store.set({ currentChat: { isLoadingOldMsg: true } });
    }
    this.socket?.send(JSON.stringify({
      content: this._offset,
      type: 'get old',
    }));
    this._offset += 20;
  }

  public sendMessage(message: Record<string, unknown>): void {
    const content = message['messagе'];
    this.socket?.send(JSON.stringify({
      content,
      type: 'message',
    }));
  }

  private _handleClose(e: any) {
    if (e.wasClean) {
      console.log('Соединение закрыто чисто');
    } else {
      console.log('Обрыв соединения');
    }

    console.log(`Код: ${e.code} | Причина: ${e.reason}`);

    this.disconnect();
    if (e.code === 1006) { // подключение было закрыто
      this._reconnect();
    }
  }
}

export default new MessageController();
