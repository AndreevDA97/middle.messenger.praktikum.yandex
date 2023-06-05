import template from './user.hbs';
import Block from '../../core/Block';
import Profile, { ProfileAction } from '../../components/profile/profile';
import FileModal from '../../components/file-modal/file-modal';

type TUserPage = {
  _profile?: string,
  _avatarEditModal?: string
};
export default class UserPage extends Block {
  constructor(props: TUserPage = {}) {
    const profile = new Profile({
        action: ProfileAction.UserEdit,
        displayName: 'Иван',
        editMode: true
    });
    const avatarEditModal = new FileModal({
        showModal: false,
        dialogId: 'user-avatar-edit',
        title: 'Загрузите файл',
        titleError: '',
        fileText: 'Выбрать файл на<br>компьютере',
        fileError: '',
        submitText: 'Поменять'
    });
    const nextProps: any = {
      ...props,
      profile,
      avatarEditModal
    };
    nextProps._profile = `<div data-id="${profile.props._id}"></div>`;
    nextProps._avatarEditModal = `<div data-id="${avatarEditModal.props._id}"></div>`;
    super('div', nextProps, template);
  }

  render() {
    return this.compile(this.props);
  }
}
