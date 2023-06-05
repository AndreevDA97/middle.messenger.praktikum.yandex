import template from './sidebar.hbs';
import Block from '../../core/Block';

export type TContact = {
    user: string,
    message: string,
    time?: string,
    count?: string,
    isMsgOwner?: boolean,
    isActive?: boolean
}
export type TSidebar = {
    contacts: Array<TContact>,
    search: string,
    profile: boolean
};
export default class Sidebar extends Block {
  
  constructor(props: TSidebar) {
    const nextProps = {
      ...props,
    };
    super('div', nextProps, template);
  }

  render() {
    return this.compile(this.props);
  }
}
