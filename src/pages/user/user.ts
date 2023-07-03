import template from './user.hbs';
import Block from '../../core/Block';
import Profile, { ProfileAction } from '../../components/profile/profile';
import FileModal from '../../components/file-modal/file-modal';
import { withStore, WithStateProps } from '../../core/utils/withStore';
import { withRouter, WithRouterProps } from '../../core/utils/withRouter';
import AuthController from '../../controllers/AuthController';
import UserController from '../../controllers/UserController';

interface TUserPage extends WithRouterProps, WithStateProps {
  _profile?: Profile,
  _avatarEditModal?: FileModal
}
class UserPage extends Block {
  constructor(props: TUserPage = {}) {
    if (!props.router || !props.store) {
      throw new Error('Ошибка инициализации');
    }
    const route = props.router.getCurrentRoute();
    let profileAction = ProfileAction.Profile;
    switch (route.getFullPath()) {
      case '/settings/logout':
        setTimeout(AuthController.logout.bind(AuthController), 0);
        break;
      case '/settings/edit': profileAction = ProfileAction.UserEdit; break;
      case '/settings/password/edit': profileAction = ProfileAction.PasswordEdit; break;
      default:
    }
    const user = props.store.getState().user || {};
    const profile = new Profile({
      action: profileAction,
      displayName: (user.login || user.display_name) as string,
      avatarSrc: UserController.getAvatarSrc(user.avatar as string),
      onClickAvatar: () => {
        this.children.avatarEditModal.setProps({ showModal: true });
      },
    });
    const avatarEditModal = new FileModal({
      showModal: false,
      dialogId: 'user-avatar-edit',
      title: 'Загрузите файл',
      titleError: '',
      fileText: 'Выбрать файл на<br>компьютере',
      fileError: '',
      fieldName: 'avatar',
      submitText: 'Поменять',
      onSubmit: (form) => {
        UserController.changeAvatar.bind(UserController)(new FormData(form));
      },
    });
    const nextProps: any = {
      ...props,
      _profile: profile,
      _avatarEditModal: avatarEditModal,
    };
    super('div', nextProps, template);
  }

  render() {
    setTimeout(() => {
      const route = this.props.router.getCurrentRoute();
      const backElement = document.getElementById('go-back');
      backElement!.onclick = () => {
        switch (route.getFullPath()) {
          case '/settings/edit': this.props.router.go('/settings'); break;
          case '/settings/password/edit': this.props.router.go('/settings'); break;
          default: this.props.router.go('/messenger'); break;
        }
      };
      window.additionalEffects.clear();
      window.additionalEffects.create();
    }, 100);
    return this.compile(this.props);
  }
}

export default withRouter(withStore(UserPage));
