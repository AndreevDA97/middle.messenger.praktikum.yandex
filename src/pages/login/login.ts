import template from './login.hbs';
import Block from '../../core/Block';
import Input, { InputType } from '../../components/input/input';
import Button, { ButtonType } from '../../components/button/button';
import validate, { RegexRules } from '../../core/utils/validateInput';
import { withStore } from '../../core/utils/withStore';
import { withRouter } from '../../core/utils/withRouter';
import AuthController from '../../controllers/AuthController';

type TLoginPage = {
  _formFields?: Record<string, Input>,
  _formButton?: Button
};
class LoginPage extends Block {
  constructor(props: TLoginPage = {}) {
    const inputs: Record<string, Input> = {
      loginInput: new Input({
        title: 'Логин',
        name: 'login',
        type: InputType.Text,
        value: '',
        check: (value) => (validate(RegexRules.LOGIN_REGEX, value)
          ? '' : 'Логин введен некорректно'),
      }),
      passwordInput: new Input({
        title: 'Пароль',
        name: 'password',
        type: InputType.Password,
        value: '',
        check: (value) => (validate(RegexRules.PASSWORD_REGEX, value)
          ? '' : 'Пароль введен некорректно'),
      }),
    };
    const button = new Button({
      title: 'Войти',
      type: ButtonType.Submit,
      events: {
        click: () => {
          const childInputs = Object.values(this.children)
            .filter((child) => child instanceof Input);
          if (childInputs.some((child) => child.props.errorMsg)) {
            console.error('Некорректный ввод данных');
            return; // не пропускать некорректный ввод
          }
          // собрать данные из полей формы
          const data: Record<string, string> = {};
          childInputs.forEach((child) => {
            data[child.props.name] = String(child.props.value);
          });
          (data);
          // отправить запрос на вход
          AuthController.login.bind(AuthController)(data);
        },
      },
    });
    const nextProps = {
      ...props,
      ...inputs,
      _formFields: inputs,
      _formButton: button,
    };
    super('div', nextProps, template);
  }

  render() {
    return this.compile(this.props);
  }
}

export default withRouter(withStore(LoginPage));
