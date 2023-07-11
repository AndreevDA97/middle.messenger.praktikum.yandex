import template from './sidebar-contacts.hbs';
import Block from '../../core/Block';
import { Chat } from '../../core/Store';
import UserController from '../../controllers/UserController';
import ChatController from '../../controllers/ChatController';
import { WithStateProps, withStore } from '../../core/utils/withStore';
import DialogController from '../../controllers/DialogController';

export type TContact = {
  chat?: Chat
  chatId?: number,
  title: string,
  avatarSrc?: string,
  message: string,
  time?: string,
  count?: string,
  isMsgOwner?: boolean,
  isActive?: boolean
};
interface TSidebarContacts extends WithStateProps {
  contacts: Array<TContact> | null,
  search: string,
  foundUsers?: Array<any> | null,
}
class SidebarContacts extends Block<TSidebarContacts> {
  constructor(props: TSidebarContacts) {
    const nextProps = {
      ...props,
      events: {
        click: async (_self: SidebarContacts, event:PointerEvent) => {
          const element = event.target as HTMLElement;
          const chatElement = element.closest('.sidebar-contacts__item[id^="chat-"]');
          if (chatElement) {
            const chatId = chatElement.id.split('-')[1];
            await DialogController.changeCurrentChat(chatId);
            this.setProps({ contacts: null });
          }
        },
      },
    };
    super('div', nextProps, template);
  }

  componentDidUpdate(_oldProps: TSidebarContacts, _newProps: Partial<TSidebarContacts>): boolean {
    if (_oldProps.contacts === null || _newProps.contacts === null) {
      const { chats, user, currentChat } = this.props.store!.getState();
      const contacts = chats?.map((c) => {
        const lastMessage = c.last_message as any;
        return ({
          chat: c,
          chatId: c.id,
          title: c.title,
          avatarSrc: UserController.getImageSrc(c.avatar as string),
          count: c.unread_count,
          time: ChatController.getDateStr(lastMessage?.time as string),
          message: lastMessage?.content as string,
          isMsgOwner: user!.login === lastMessage?.user.login,
          isActive: c.id === currentChat?.chat?.id,
        } as TContact);
      });
      if (contacts) {
        this.setProps({ contacts });
        return false;
      }
    }
    return true;
  }

  render() {
    return this.compile(this.props);
  }
}

export default withStore(SidebarContacts);
