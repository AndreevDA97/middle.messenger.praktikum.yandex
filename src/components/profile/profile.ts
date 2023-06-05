import template from './profile.hbs';
import Block from '../../core/Block';
import Button, { ButtonType } from '../../components/button/button';
import Input, { InputType, InputTemplate } from '../input/input';
import validate, { RegexRules } from '../../core/utils/validateInput';

export enum ProfileAction {
    Profile,
    UserEdit,
    PasswordEdit
}
type TProfile = {
    action: ProfileAction,
    displayName: string,
    editMode: boolean,
};
export default class Profile extends Block {
  constructor(props: TProfile) {
    let formFields: Record<string, Input> = {};
    if (props.action === ProfileAction.Profile
        || props.action === ProfileAction.UserEdit) {
        formFields = {
            emailInput: new Input({
                title: 'Почта',
                name: 'email',
                type: InputType.Text,
                template: InputTemplate.Profile,
                value: 'pochta@mail.ru',
                editMode: props.editMode,
                check: (value) => (validate(RegexRules.EMAIL_REGEX, value)
                    ? '' : 'Ошибка ввода почты'),
            }),
            loginInput: new Input({
                title: 'Логин',
                name: 'login',
                type: InputType.Text,
                template: InputTemplate.Profile,
                value: 'ivanivanov',
                editMode: props.editMode,
                check: (value) => (validate(RegexRules.LOGIN_REGEX, value)
                    ? '' : 'Ошибка ввода логина'),
            }),
            firstNameInput: new Input({
                title: 'Имя',
                name: 'first_name',
                type: InputType.Text,
                template: InputTemplate.Profile,
                value: 'Иван',
                editMode: props.editMode,
                check: (value) => (validate(RegexRules.NAME_REGEX, value)
                    ? '' : 'Ошибка ввода имени'),
            }),
            secondNameInput: new Input({
                title: 'Фамилия',
                name: 'second_name',
                type: InputType.Text,
                template: InputTemplate.Profile,
                value: 'Иванов',
                editMode: props.editMode,
                check: (value) => (validate(RegexRules.NAME_REGEX, value)
                    ? '' : 'Ошибка ввода фамилии'),
            }),
            displayNameInput: new Input({
                title: 'Имя в чате',
                name: 'display_name',
                type: InputType.Text,
                template: InputTemplate.Profile,
                value: 'Иван',
                editMode: props.editMode
            }),
            phoneInput: new Input({
                title: 'Телефон',
                name: 'phone',
                type: InputType.Text,
                template: InputTemplate.Profile,
                value: '+79099342354',
                editMode: props.editMode,
                check: (value) => (validate(RegexRules.PHONE_REGEX, value)
                    ? '' : 'Ошибка ввода телефона'),
            }),
        };
    }
    else if (props.action === ProfileAction.PasswordEdit) {
        formFields = {
            emailInput: new Input({
                title: 'Почта',
                name: 'email',
                type: InputType.Text,
                template: InputTemplate.Profile,
                value: 'pochta@mail.ru',
                editMode: props.editMode,
                check: (value) => (validate(RegexRules.EMAIL_REGEX, value)
                    ? '' : 'Ошибка ввода почты'),
            }),
        };
    }
    const button = new Button({
        title: 'Сохранить',
        type: ButtonType.Submit,
        events: {
          click: () => {
            const inputs = Object.values(this.children)
              .filter(child => child instanceof Input);
            if (inputs.some(child => child.props.errorMsg))
            {
              console.error('Некорректный ввод данных');
              return; // не пропускать некорректный ввод
            }
            // собрать данные из полей формы
            const data: Record<string, string> = {};
            inputs.forEach(child => {
                data[child.props.name] = String(child.props.value);
            });
            console.log(data);
          }
        }
      });
    const nextProps: any = {
      ...props,
      ...formFields,
      button
    };
    nextProps._formFields = '';
    Object.values(formFields).forEach((input: Block) => {
      nextProps._formFields += `<div data-id="${input.props._id}"></div>`;
    });
    nextProps._formButtons = `<div data-id="${button.props._id}"></div>`;
    super('div', nextProps, template);
  }

  render() {
    return this.compile(this.props);
  }
}
