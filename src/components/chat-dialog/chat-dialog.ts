import template from './chat-dialog.hbs';
import Block from '../../core/Block';
import { withStore, WithStateProps } from '../../core/utils/withStore';

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
  welcome: boolean,
  chatter: string,
  history: Array<THistoryMsg>,
  openUserMenu: boolean,
  openAttachmentMenu: boolean,
  chatId?: number
}
class ChatDialog extends Block<TChatDialog> {
  constructor(props: TChatDialog) {
    const nextProps = {
      ...props,
    };
    super('div', nextProps, template);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  componentDidUpdate(_oldProps: TChatDialog, _newProps: Partial<TChatDialog>): boolean {
    if (_oldProps.chatId && _newProps.chatId && _oldProps.chatId !== _newProps.chatId) {
      return true;
    }
    const activeChat = this.props.store?.getState().currentChat?.chat;
    if (this.props.chatId && activeChat && this.props.chatId !== activeChat.id) {
      this.setProps({
        chatter: activeChat.title,
        chatId: activeChat.id,
      });
      return true;
    }
    if (this.props.welcome && activeChat) {
      this.setProps({
        welcome: false,
        chatter: activeChat.title,
        chatId: activeChat.id,
      });
      return true;
    }
    if (!this.props.welcome && !activeChat) {
      this.setProps({ welcome: true });
      return true;
    }
    return false;
  }

  render() {
    console.log('RENDER');
    return this.compile(this.props);
  }
}

export default withStore(ChatDialog);
