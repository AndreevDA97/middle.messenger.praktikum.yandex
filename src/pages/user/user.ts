import template from './user.hbs';
import Block from '../../core/Block';
import Profile, { ProfileAction } from '../../components/profile/profile';
import FileModal from '../../components/file-modal/file-modal';
import { withStore } from '../../core/utils/withStore';
import { withRouter } from '../../core/utils/withRouter';
import { rootRouter } from '../../core/Router';
import AuthController from '../../controllers/AuthController';

type TUserPage = {
  _profile?: Profile,
  _avatarEditModal?: FileModal
};
class UserPage extends Block {
  constructor(props: TUserPage = {}) {
    const route = rootRouter.getCurrentRoute();
    let profileAction = ProfileAction.Profile;
    switch (route.getFullPath()) {
      case '/settings/logout':
        setTimeout(AuthController.logout.bind(AuthController), 0);
        break;
      case '/settings/edit': profileAction = ProfileAction.UserEdit; break;
      case '/settings/password/edit': profileAction = ProfileAction.PasswordEdit; break;
      default:
    }
    const profile = new Profile({
      action: profileAction,
      displayName: 'Иван',
    });
    const avatarEditModal = new FileModal({
      showModal: false,
      dialogId: 'user-avatar-edit',
      title: 'Загрузите файл',
      titleError: '',
      fileText: 'Выбрать файл на<br>компьютере',
      fileError: '',
      submitText: 'Поменять',
    });
    const nextProps: any = {
      ...props,
      profile,
      avatarEditModal,
    };
    nextProps._profile = profile;
    nextProps._avatarEditModal = avatarEditModal;
    super('div', nextProps, template);
  }

  componentDidMount() {
    setTimeout(() => {
      const route = rootRouter.getCurrentRoute();
      const backElement = document.getElementById('go-back');
      backElement!.onclick = () => {
        switch (route.getFullPath()) {
          case '/settings/edit': this.props.router.go('/settings'); break;
          case '/settings/password/edit': this.props.router.go('/settings'); break;
          default: this.props.router.go('/messenger'); break;
        }
      };
      window.additionalEffects.create();
    }, 100);
  }

  componentWillUnmount() {
    window.additionalEffects.clear();
  }

  render() {
    return this.compile(this.props);
  }
}

export default withRouter(withStore(UserPage));
