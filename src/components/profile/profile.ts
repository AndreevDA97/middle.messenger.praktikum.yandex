import template from './profile.hbs';
import Block from '../../core/Block';
import Button, { ButtonType } from '../button/button';
import Input, { InputType, InputTemplate } from '../input/input';
import validate, { RegexRules } from '../../core/utils/validateInput';
import UserController from '../../controllers/UserController';
import { rootStore } from '../../core/Store';

export enum ProfileAction {
  Profile,
  UserEdit,
  PasswordEdit,
}
type TProfile = {
  action?: ProfileAction,
  displayName: string,
  avatarSrc?: string,
  editMode?: boolean,
  onClickAvatar?: () => void,
  _formFields?: Record<string, Input>,
  _formButton?: Button
};
export default class Profile extends Block {
  constructor(props: TProfile) {
    const userInfo = rootStore.getState().user || {};
    let formFields: Record<string, Input> = {};
    if (props.action === ProfileAction.Profile
        || props.action === ProfileAction.UserEdit) {
      formFields = {
        emailInput: new Input({
          title: 'Почта',
          name: 'email',
          type: InputType.Text,
          template: InputTemplate.Profile,
          value: userInfo.email as string,
          editMode: props.action === ProfileAction.UserEdit,
          check: (value) => (validate(RegexRules.EMAIL_REGEX, value)
            ? '' : 'Ошибка ввода почты'),
        }),
        loginInput: new Input({
          title: 'Логин',
          name: 'login',
          type: InputType.Text,
          template: InputTemplate.Profile,
          value: userInfo.login as string,
          editMode: props.action === ProfileAction.UserEdit,
          check: (value) => (validate(RegexRules.LOGIN_REGEX, value)
            ? '' : 'Ошибка ввода логина'),
        }),
        firstNameInput: new Input({
          title: 'Имя',
          name: 'first_name',
          type: InputType.Text,
          template: InputTemplate.Profile,
          value: userInfo.first_name as string,
          editMode: props.action === ProfileAction.UserEdit,
          check: (value) => (validate(RegexRules.NAME_REGEX, value)
            ? '' : 'Ошибка ввода имени'),
        }),
        secondNameInput: new Input({
          title: 'Фамилия',
          name: 'second_name',
          type: InputType.Text,
          template: InputTemplate.Profile,
          value: userInfo.second_name as string,
          editMode: props.action === ProfileAction.UserEdit,
          check: (value) => (validate(RegexRules.NAME_REGEX, value)
            ? '' : 'Ошибка ввода фамилии'),
        }),
        displayNameInput: new Input({
          title: 'Имя в чате',
          name: 'display_name',
          type: InputType.Text,
          template: InputTemplate.Profile,
          value: userInfo.display_name as string,
          editMode: props.action === ProfileAction.UserEdit,
        }),
        phoneInput: new Input({
          title: 'Телефон',
          name: 'phone',
          type: InputType.Text,
          template: InputTemplate.Profile,
          value: userInfo.phone as string,
          editMode: props.action === ProfileAction.UserEdit,
          check: (value) => (validate(RegexRules.PHONE_REGEX, value)
            ? '' : 'Ошибка ввода телефона'),
        }),
      };
    } else if (props.action === ProfileAction.PasswordEdit) {
      formFields = {
        oldPasswordInput: new Input({
          title: 'Старый пароль',
          name: 'oldPassword',
          type: InputType.Password,
          template: InputTemplate.Profile,
          value: '',
          placeholder: '••••••',
          editMode: true,
          check: (value) => (validate(RegexRules.PASSWORD_REGEX, value)
            ? '' : 'Ошибка ввода пароля'),
        }),
        newPasswordAttemptInput: new Input({
          title: 'Новый пароль',
          name: 'newPasswordAttempt',
          type: InputType.Password,
          template: InputTemplate.Profile,
          value: '',
          placeholder: '••••••••',
          editMode: true,
          check: (value) => (validate(RegexRules.PASSWORD_REGEX, value)
            ? '' : 'Ошибка ввода пароля'),
        }),
        newPasswordInput: new Input({
          title: 'Повторите новый пароль',
          name: 'newPassword',
          type: InputType.Password,
          template: InputTemplate.Profile,
          value: '',
          placeholder: '••••••••',
          editMode: true,
          check: (value) => (validate(RegexRules.PASSWORD_REGEX, value)
            ? '' : 'Ошибка ввода пароля'),
        }),
      };
    }
    const button = new Button({
      title: 'Сохранить',
      type: ButtonType.Submit,
      events: {
        click: () => {
          const inputs = Object.values(this.children)
            .filter((child) => child instanceof Input);
          if (inputs.some((child) => child.props.errorMsg)) {
            console.error('Некорректный ввод данных');
            return; // не пропускать некорректный ввод
          }
          // собрать данные из полей формы
          const data: Record<string, string> = {};
          inputs.forEach((child) => {
            data[child.props.name] = String(child.props.value);
          });
          console.log(data);
          // отправить запрос на изменение данных
          if (props.action === ProfileAction.PasswordEdit) {
            UserController.changePassword.bind(UserController)(data);
          } else if (props.action === ProfileAction.UserEdit) {
            UserController.changeData.bind(UserController)(data);
          }
        },
      },
    });
    const nextProps: any = {
      ...props,
      ...formFields,
      _formFields: formFields,
      _formButton: button,
    };
    nextProps.editMode = props.action === ProfileAction.UserEdit
        || props.action === ProfileAction.PasswordEdit;
    super('div', nextProps, template);
  }

  render() {
    setTimeout(() => {
      const avatarElement = document.getElementById('user-avatar');
      avatarElement!.onclick = () => {
        this.props.onClickAvatar();
      };
    }, 100);
    return this.compile(this.props);
  }
}
