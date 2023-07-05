import template from './chat.hbs';
import Block from '../../core/Block';
import Sidebar from '../../components/sidebar/sidebar';
import ChatDialog, { MsgType, SenderType } from '../../components/chat-dialog/chat-dialog';
import UserModal from '../../components/user-modal/user-modal';
import chatterPhoto from '../../../static/images/chatter_photo.png';
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
      avatarSrc: UserController.getAvatarSrc(user.avatar as string),
      showChatAdd: false,
      onChatAdd: () => {
        this.children._sidebar.setProps({ showChatAdd: true });
        this.children._chatAddModal.setProps({ showModal: true });
      },
    });
    const chatDialog = new ChatDialog({
      welcome: true,
      chatter: 'Вадим',
      history: [
        { sender: SenderType.Owner, type: MsgType.Text, message: 'Круто!', time: '12:00', delivered: true },
        { sender: SenderType.Chatter, type: MsgType.Image, image: chatterPhoto, time: '11:56' },
        { sender: SenderType.Chatter, type: MsgType.Text, message: 'Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой.\r\n\r\nХассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.', time: '11:56' },
        { sender: SenderType.System, type: MsgType.Text, message: '19 июня' },
      ],
      openUserMenu: false,
      openAttachmentMenu: false,
    });
    const chatAddModal = new UserModal({
      showModal: false,
      dialogId: 'chat-add',
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
    // обновить список чатовs
    ChatController.getChats();
  }

  render() {
    setTimeout(() => {
      window.additionalEffects.clear();
      window.additionalEffects.create(() => {
        this.children._sidebar.setProps({ showChatAdd: false });
      });
    }, 100);
    return this.compile(this.props);
  }
}

export default withRouter(withStore(ChatPage));
