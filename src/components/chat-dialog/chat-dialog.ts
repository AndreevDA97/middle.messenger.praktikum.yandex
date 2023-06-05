import template from './chat-dialog.hbs';
import Block from '../../core/Block';

export enum SenderType {
    Owner ='owner',
    Chatter = 'chatter',
    System = 'system'
}
export enum MsgType {
    Text = 'text',
    Image = 'image'
}
export type THistoryMsg = {
    type: MsgType,
    sender: SenderType,
    message?: string,
    image?: string,
    time?: string,
    delivered?: true
}
export type TChatDialog = {
    chatter: string,
    history: Array<THistoryMsg>,
    openUserMenu: boolean,
    openAttachmentMenu: boolean
};
export default class ChatDialog extends Block {
  
  constructor(props: TChatDialog) {
    const nextProps = {
      ...props,
    };
    super('div', nextProps, template);
  }

  render() {
    return this.compile(this.props);
  }
}
