import template from './user.hbs';
import Block from '../../core/Block';
import Profile, { ProfileAction } from '../../components/profile/profile';
import FileModal from '../../components/file-modal/file-modal';
import { withStore } from '../../core/utils/withStore';
import { withRouter } from '../../core/utils/withRouter';

type TUserPage = {
  _profile?: Profile,
  _avatarEditModal?: FileModal
};
class UserPage extends Block {
  constructor(props: TUserPage = {}) {
    const profile = new Profile({
      action: ProfileAction.PasswordEdit,
      displayName: 'Иван',
      editMode: true,
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
    console.log(props);
    super('div', nextProps, template);
  }

  componentDidMount() {
    setTimeout(() => {
      const backElement = document.getElementById('go-back');
      backElement!.onclick = () => { this.props.router.back(); };
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
