import template from './chat.hbs';
import Block from '../../core/Block';
import Sidebar from '../../components/sidebar/sidebar';
import ChatDialog from '../../components/chat-dialog/chat-dialog';
import UserModal from '../../components/user-modal/user-modal';
import { WithStateProps, withStore } from '../../core/utils/withStore';
import { withRouter, WithRouterProps } from '../../core/utils/withRouter';
import UserController from '../../controllers/UserController';
import ChatController from '../../controllers/ChatController';
import { RoutePath } from '../../core/utils/configuration';

interface TChatPage extends WithRouterProps, WithStateProps {
  _sidebar?: Sidebar,
  _chatDialog?: typeof ChatDialog,
  _chatAddModal?: UserModal
}
class ChatPage extends Block<TChatPage> {
  constructor(props: TChatPage) {
    if (!props.router || !props.store) {
      throw new Error('Ошибка инициализации');
    }
    const user = props.store.getState().user || {};
    const sidebar = new Sidebar({
      contacts: null,
      search: '',
      avatarSrc: UserController.getImageSrc(user.avatar as string),
      showChatAdd: false,
      onChatAdd: () => {
        this.children._sidebar.setProps({ showChatAdd: true });
        this.children._chatAddModal.setProps({ showModal: true });
      },
    });
    const chatDialog = new ChatDialog({
      chatId: null,
      isLoading: true,
      openUserMenu: false,
      openAttachmentMenu: false,
    });
    const chatAddModal = new UserModal({
      showModal: false,
      dialogId: 'dlg-chat-add',
      title: 'Создать чат',
      titleError: '',
      fieldName: 'title',
      fieldTitle: 'Название',
      fieldPlaceholder: 'Введите название чата',
      submitText: 'Создать',
      onSubmit: async (_, value) => {
        await ChatController.createChat.bind(ChatController)(value);
        this.props.router!.go(RoutePath.Chat);
      },
    });
    const nextProps: any = {
      ...props,
      _sidebar: sidebar,
      _chatDialog: chatDialog,
      _chatAddModal: chatAddModal,
    };
    super('div', nextProps, template);
    // обновить список чатов
    ChatController.getChats();
  }

  render() {
    setTimeout(() => {
      window.additionalEffects.clear();
      window.additionalEffects.create(() => {
        this.children._sidebar.setProps({ showChatAdd: false });
      });
    }, 500);
    return this.compile(this.props);
  }
}

export default withRouter(withStore(ChatPage));
