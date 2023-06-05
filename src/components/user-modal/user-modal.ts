import template from './user-modal.hbs';
import Block from '../../core/Block';

export type TUserModal = {
    showModal: boolean,
    dialogId: string,
    title: string,
    titleError: string,
    login: string,
    loginError: string,
    submitText: string
};
export default class UserModal extends Block {
  
  constructor(props: TUserModal) {
    const nextProps = {
      ...props,
    };
    super('div', nextProps, template);
  }

  render() {
    return this.compile(this.props);
  }
}
