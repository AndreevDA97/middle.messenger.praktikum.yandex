import template from './register.hbs';
import Block from '../../core/Block';
import Input, { InputType } from '../../components/input/input';
import Button, { ButtonType } from '../../components/button/button';
import validate, { RegexRules } from '../../core/utils/validateInput';
import { withStore } from '../../core/utils/withStore';
import { withRouter } from '../../core/utils/withRouter';
import AuthController from '../../controllers/AuthController';

type TRegisterPage = {
  _formFields?: Record<string, Input>,
  _formButton?: Button
};
class RegisterPage extends Block {
  constructor(props: TRegisterPage = {}) {
    const inputs: Record<string, Input> = {
      emailInput: new Input({
        title: 'Почта',
        name: 'email',
        type: InputType.Text,
        value: '',
        check: (value) => (validate(RegexRules.EMAIL_REGEX, value)
          ? '' : 'Ошибка ввода почты'),
      }),
      loginInput: new Input({
        title: 'Логин',
        name: 'login',
        type: InputType.Text,
        value: '',
        check: (value) => (validate(RegexRules.LOGIN_REGEX, value)
          ? '' : 'Ошибка ввода логина'),
      }),
      firstNameInput: new Input({
        title: 'Имя',
        name: 'first_name',
        type: InputType.Text,
        value: '',
        check: (value) => (validate(RegexRules.NAME_REGEX, value)
          ? '' : 'Ошибка ввода имени'),
      }),
      secondNameInput: new Input({
        title: 'Фамилия',
        name: 'second_name',
        type: InputType.Text,
        value: '',
        check: (value) => (validate(RegexRules.NAME_REGEX, value)
          ? '' : 'Ошибка ввода фамилии'),
      }),
      phoneInput: new Input({
        title: 'Телефон',
        name: 'phone',
        type: InputType.Text,
        value: '',
        check: (value) => (validate(RegexRules.PHONE_REGEX, value)
          ? '' : 'Ошибка ввода телефона'),
      }),
      passwordAttemptInput: new Input({
        title: 'Пароль',
        name: 'password_attempt',
        type: InputType.Password,
        value: '',
        check: (value) => (validate(RegexRules.PASSWORD_REGEX, value)
          ? '' : 'Ошибка ввода пароля'),
      }),
      passwordInput: new Input({
        title: 'Пароль (ещё раз)',
        name: 'password',
        type: InputType.Password,
        value: '',
        check: (value) => (validate(RegexRules.PASSWORD_REGEX, value)
          ? '' : 'Ошибка ввода повторного пароля'),
      }),
    };
    const button = new Button({
      title: 'Зарегистрироваться',
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
          console.log(data);
          // отправить запрос на регистрацию
          AuthController.register.bind(AuthController)(data);
        },
      },
    });
    const nextProps: any = {
      ...props,
      ...inputs,
      button,
    };
    nextProps._formFields = inputs;
    nextProps._formButton = button;
    super('div', nextProps, template);
  }

  render() {
    return this.compile(this.props);
  }
}

export default withRouter(withStore(RegisterPage));
