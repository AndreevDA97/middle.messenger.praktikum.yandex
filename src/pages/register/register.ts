import template from './register.hbs';
import Block from '../../core/Block';
import Input, { InputType } from '../../components/input/input';
import Button, { ButtonType } from '../../components/button/button';
import validate, { RegexRules } from '../../core/utils/validateInput';

type TRegisterPage = {
  _formFields?: string,
  _formButtons?: string
};
export default class RegisterPage extends Block {
  constructor(props: TRegisterPage = {}) {
    const inputs: Record<string, Input> = {
      emailInput: new Input({
        title: 'Почта',
        name: 'email',
        type: InputType.Text,
        value: 'pochta@mail.ru',
        check: (value) => (validate(RegexRules.EMAIL_REGEX, value)
          ? '' : 'Ошибка ввода почты'),
      }),
      loginInput: new Input({
        title: 'Логин',
        name: 'login',
        type: InputType.Text,
        value: 'ivanivanov',
        check: (value) => (validate(RegexRules.LOGIN_REGEX, value)
          ? '' : 'Ошибка ввода логина'),
      }),
      firstNameInput: new Input({
        title: 'Имя',
        name: 'first_name',
        type: InputType.Text,
        value: 'Иван',
        check: (value) => (validate(RegexRules.NAME_REGEX, value)
          ? '' : 'Ошибка ввода имени'),
      }),
      secondNameInput: new Input({
        title: 'Фамилия',
        name: 'second_name',
        type: InputType.Text,
        value: 'Иванов',
        check: (value) => (validate(RegexRules.NAME_REGEX, value)
          ? '' : 'Ошибка ввода фамилии'),
      }),
      phoneInput: new Input({
        title: 'Телефон',
        name: 'phone',
        type: InputType.Text,
        value: '+79099342354',
        check: (value) => (validate(RegexRules.PHONE_REGEX, value)
          ? '' : 'Ошибка ввода телефона'),
      }),
      passwordAttemptInput: new Input({
        title: 'Пароль',
        name: 'password_attempt',
        type: InputType.Password,
        value: 'qwerty1234',
        check: (value) => (validate(RegexRules.PASSWORD_REGEX, value)
          ? '' : 'Ошибка ввода пароля'),
      }),
      passwordInput: new Input({
        title: 'Пароль (ещё раз)',
        name: 'password',
        type: InputType.Password,
        value: 'qwerty',
        check: (value) => (validate(RegexRules.PASSWORD_REGEX, value)
          ? '' : 'Ошибка ввода повторного пароля'),
      }),
    };
    const button = new Button({
      title: 'Зарегистрироваться',
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
      ...inputs,
      button
    };
    nextProps._formFields = '';
    Object.values(inputs).forEach((input: Block) => {
      nextProps._formFields += `<div data-id="${input.props._id}"></div>`;
    });
    nextProps._formButtons = `<div data-id="${button.props._id}"></div>`;
    super('div', nextProps, template);
  }

  render() {
    return this.compile(this.props);
  }
}
