import template from './sidebar-contacts.hbs';
import Block from '../../core/Block';

export type TContact = {
  user: string,
  message: string,
  time?: string,
  count?: string,
  isMsgOwner?: boolean,
  isActive?: boolean
};
type TSidebarContacts = {
  contacts: Array<TContact>,
  search: string,
  foundUsers?: Array<any> | null,
};
export default class SidebarContacts extends Block {
  constructor(props: TSidebarContacts) {
    const nextProps = {
      ...props,
    };
    super('div', nextProps, template);
  }

  render() {
    return this.compile(this.props);
  }
}
