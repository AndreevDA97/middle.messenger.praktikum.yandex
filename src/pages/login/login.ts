import template from './login.hbs';
import Block from '../../core/Block';
import Input, { InputType } from '../../components/form-input/input';
import validate, { RegexRules } from '../../core/utils/validateInput';

type TLoginPage = {
  _formFields?: string
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
    const nextProps = {
      ...props,
      ...inputs,
      _formFields: '',
    };
    Object.values(inputs).forEach((input: Block) => {
      nextProps._formFields += `<div data-id="${input.props._id}"></div>`;
    });
    super('div', nextProps, template);
  }

  render() {
    return this.compile(this.props);
  }
}
