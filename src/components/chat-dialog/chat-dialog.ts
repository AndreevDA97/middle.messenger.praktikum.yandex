import template from './chat-dialog.hbs';
import Block from '../../core/Block';
import { withStore, WithStateProps } from '../../core/utils/withStore';
import UserModal from '../user-modal/user-modal';
import ChatController from '../../controllers/ChatController';
import DialogController from '../../controllers/DialogController';
import UserController from '../../controllers/UserController';

export enum SenderType {
  Owner = 'owner',
  Chatter = 'chatter',
  System = 'system',
}
export enum MsgType {
  Text = 'text',
  Image = 'image',
}
export type THistoryMsg = {
  type: MsgType,
  sender: SenderType,
  message?: string,
  image?: string,
  time?: string,
  delivered?: true
};
interface TChatDialog extends WithStateProps {
  chatId?: number | null,
  chatter?: string | null,
  isLoading?: boolean,
  history?: Array<THistoryMsg> | null,
  historyNeedUpdate?: boolean,
  openUserMenu: boolean,
  openAttachmentMenu: boolean,
  _userAddModal?: UserModal,
  _userRemoveModal?: UserModal,
  _chatRemoveModal?: UserModal
}
class ChatDialog extends Block<TChatDialog> {
  constructor(props: TChatDialog) {
    const userAddModal = new UserModal({
      showModal: false,
      dialogId: 'dlg-user-add',
      title: 'Добавить пользователя',
      fieldName: 'login',
      fieldTitle: 'Логин',
      fieldPlaceholder: 'Введите логин',
      submitText: 'Добавить',
      onSubmit: async (_form, value) => {
        const success = await ChatController.addUser.bind(ChatController)(value);
        if (success) this.children._userAddModal.setProps({ showModal: false });
        else {
          const error = 'Ошибка добавления пользователя';
          this.children._userAddModal.setProps({ titleError: error, fieldError: error });
        }
      },
    });
    const userRemoveModal = new UserModal({
      showModal: false,
      dialogId: 'dlg-user-remove',
      title: 'Удалить пользователя',
      fieldName: 'login',
      fieldTitle: 'Логин',
      fieldPlaceholder: 'Введите логин',
      submitText: 'Удалить',
      onSubmit: async (_form, value) => {
        const success = await ChatController.removeUser.bind(ChatController)(value);
        if (success) this.children._userRemoveModal.setProps({ showModal: false });
        else {
          const error = 'Ошибка добавления пользователя';
          this.children._userRemoveModal.setProps({ titleError: error, fieldError: error });
        }
      },
    });
    const chatRemoveModal = new UserModal({
      showModal: false,
      dialogId: 'dlg-chat-remove',
      title: 'Удалить текущий чат',
      fieldName: 'title',
      fieldTitle: 'Название',
      fieldPlaceholder: 'Введите название чата',
      fieldDisabled: true,
      submitText: 'Удалить',
      onSubmit: async () => {
        await ChatController.deleteChat.bind(ChatController)();
        this.children._chatRemoveModal.setProps({ showModal: false });
      },
    });
    const nextProps = {
      ...props,
      _userAddModal: userAddModal,
      _userRemoveModal: userRemoveModal,
      _chatRemoveModal: chatRemoveModal,
    };
    super('div', nextProps, template);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  componentDidUpdate(_oldProps: TChatDialog, _newProps: Partial<TChatDialog>): boolean {
    const { currentChat, user } = this.props.store!.getState();
    if (!currentChat) return false;
    // отловить событие изменения чата (изменение Store)
    const chatInfo = currentChat.chat;
    if (chatInfo?.id !== this.props.chatId
        // дождаться полного завершения загрузки чата
        && currentChat.isLoading !== this.props.isLoading) {
      // обновить компонент
      setTimeout(() => {
        this.setProps({
          // обновление сообщений в диалоге чата
          chatId: chatInfo?.id,
          chatter: chatInfo?.title,
          // обновление статуса загрузки чата
          isLoading: currentChat.isLoading,
        });
      }, 100);
      return false;
    }
    // отловить событие обновления сообщений в чате (изменение Store)
    if (currentChat.messages?.length !== this.props.history?.length) {
      // обновить компонент
      setTimeout(() => {
        this.setProps({
          // обновление сообщений в диалоге чата
          history: currentChat.messages?.map((m: any) => ({
            type: m.type === 'message' ? MsgType.Text : MsgType.Image,
            image: UserController.getImageSrc(m.file),
            message: m.content,
            delivered: m.is_read,
            time: ChatController.getDateStr(m.time),
            sender: m.user_id === user!.id ? SenderType.Owner : SenderType.Chatter,
          } as THistoryMsg)),
        });
      }, 100);
      return false;
    }
    return true;
  }

  render() {
    setTimeout(() => {
      if (!document.querySelector('.chat-dialog')) return;
      const sendElement = document.querySelector<HTMLElement>('.chat-input__send');
      sendElement!.onclick = () => {
        const form = document.getElementById('user-message') as HTMLFormElement;
        const input = form.elements.namedItem('message') as HTMLInputElement;
        if (input.value) DialogController.sendMessage.bind(DialogController)(input.value);
        input.value = '';
      };
      const userAddElement = document.getElementById('user-add');
      userAddElement!.onclick = () => {
        this.children._userAddModal.setProps({ showModal: true, titleError: '', fieldError: '' });
      };
      const userRemoveElement = document.getElementById('user-remove');
      userRemoveElement!.onclick = () => {
        this.children._userRemoveModal.setProps({ showModal: true, titleError: '', fieldError: '' });
      };
      const chatRemoveElement = document.getElementById('chat-remove');
      chatRemoveElement!.onclick = () => {
        const chatTitle = this.props.store?.getState()?.currentChat?.chat?.title;
        this.children._chatRemoveModal.setProps({ showModal: true, titleError: '', fieldError: '', fieldValue: chatTitle });
      };
    }, 100);
    return this.compile(this.props);
  }
}

export default withStore(ChatDialog);
