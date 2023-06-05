import template from './chat.hbs';
import Block from '../../core/Block';
import Sidebar from '../../components/sidebar/sidebar';
import ChatDialog, { MsgType, SenderType } from '../../components/chat-dialog/chat-dialog';
import UserModal from '../../components/user-modal/user-modal';
import chatterPhoto from '../../../static/images/chatter_photo.png';

type TChatPage = {
  _sidebar?: string,
  _chatDialog?: string,
  _chatAddModal?: string
};
export default class ChatPage extends Block {
  constructor(props: TChatPage = {}) {

    const sidebar = new Sidebar({
        contacts: [
            { user: 'Андрей', message: 'Изображение', time: '10:49', count: '2' },
            { user: 'Киноклуб', message: 'стикер', isMsgOwner: true, time: '12:00' },
            { user: 'Илья', message: 'Друзья, у меня для вас особенный выпуск новостей!...', time: '15:12', count: '4' },
            { user: 'Вадим', message: 'Круто!', isMsgOwner: true, time: 'Пт', isActive: true },
            { user: 'тет-а-теты', message: 'И Human Interface Guidelines и Material Design рекомендуют...', time: 'Ср' },
            { user: '1, 2, 3', message: 'Миллионы россиян ежедневно проводят десятки часов свое...', time: 'Пн' },
            { user: 'Design Destroyer', message: 'В 2008 году художник Jon Rafman начал собирать...', time: 'Пн' },
            { user: 'Day.', message: 'Так увлёкся работой по курсу, что совсем забыл его анонсир...', time: '1 Мая 2020' },
            { user: 'Стас Рогозин', message: 'Можно или сегодня или завтра вечером.', time: '12 Апр 2020' },
        ],
        search: '',
        profile: false
    });
    const chatDialog = new ChatDialog({
        chatter: 'Вадим',
        history: [
            { sender: SenderType.Owner, type: MsgType.Text, message: 'Круто!', time: '12:00', delivered: true },
            { sender: SenderType.Chatter, type: MsgType.Image, image: chatterPhoto, time: '11:56' },
            { sender: SenderType.Chatter, type: MsgType.Text, message: 'Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой.\r\n\r\nХассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.', time: '11:56' },
            { sender: SenderType.System, type: MsgType.Text, message: '19 июня' }
        ],
        openUserMenu: false,
        openAttachmentMenu: false
    });
    const chatAddModal = new UserModal({
        showModal: false,
        dialogId: 'chat-add',
        title: 'Добавить пользователя',
        titleError: '',
        login: 'ivanivanov',
        loginError: '',
        submitText: 'Добавить'
    });
    const nextProps: any = {
      ...props,
      sidebar,
      chatDialog,
      chatAddModal
    };
    nextProps._sidebar = `<div data-id="${sidebar.props._id}"></div>`;
    nextProps._chatDialog = `<div data-id="${chatDialog.props._id}"></div>`;
    nextProps._chatAddModal = `<div data-id="${chatAddModal.props._id}"></div>`;
    super('div', nextProps, template);
  }

  render() {
    return this.compile(this.props);
  }
}
