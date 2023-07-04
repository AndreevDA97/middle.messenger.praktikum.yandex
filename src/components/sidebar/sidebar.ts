import template from './sidebar.hbs';
import Block from '../../core/Block';
import UserController from '../../controllers/UserController';
import SidebarContacts, { TContact } from '../sidebar-contacts/sidebar-contacts';

export type TSidebar = {
  contacts: Array<TContact>,
  search: string,
  avatarSrc?: string,
  profile: boolean,
  _sidebarContacts?: SidebarContacts
};
export default class Sidebar extends Block {
  constructor(props: TSidebar) {
    const sidebarContacts = new SidebarContacts({
      contacts: props.contacts,
      search: props.search,
    });
    const nextProps = {
      ...props,
      _sidebarContacts: sidebarContacts,
    };
    super('div', nextProps, template);
  }

  render() {
    setTimeout(() => {
      const searchElement = document.getElementById('user-search');
      searchElement!.onkeyup = (event) => {
        const { value } = event.target as HTMLInputElement;
        UserController.searchUsers(this.children._sidebarContacts, value);
      };
    }, 100);
    return this.compile(this.props);
  }
}
