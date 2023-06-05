import template from './login.hbs';
import Block from '../../core/Block';
import Input, { InputType } from '../../components/input/input';
import Button, { ButtonType } from '../../components/button/button';
import validate, { RegexRules } from '../../core/utils/validateInput';

type TLoginPage = {
  _formFields?: string,
  _formButtons?: string
};
export default class LoginPage extends Block {
  constructor(props: TLoginPage = {}) {
    const inputs: Record<string, Input> = {
      loginInput: new Input({
        title: 'Логин',
        name: 'login',
        type: InputType.Text,
        value: 'ivanivanov',
        check: (value) => (validate(RegexRules.LOGIN_REGEX, value)
          ? '' : 'Ошибка ввода логина'),
      }),
      passwordInput: new Input({
        title: 'Пароль',
        name: 'password',
        type: InputType.Password,
        value: 'qwerty123',
        check: (value) => (validate(RegexRules.PASSWORD_REGEX, value)
          ? '' : 'Ошибка ввода пароля'),
      }),
    };
    const button = new Button({
      title: 'Войти',
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
    const nextProps = {
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
