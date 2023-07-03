import templateDefault from './input.hbs';
import templateProfile from './input-profile.hbs';
import Block from '../../core/Block';

export enum InputTemplate {
  Default,
  Profile,
}
export enum InputType {
  Text = 'text',
  Password = 'password',
  File = 'file',
}
export type TInput = {
  title: string,
  type?: InputType,
  name: string,
  value: string,
  placeholder?: string,
  editMode?: boolean,
  errorMsg?: string,
  check?: (value: string) => string,
  events?: Record<string, Function>,
  template?: InputTemplate 
};
export default class Input extends Block {
  constructor(props: TInput) {
    const nextProps = {
      ...props,
      events: {
        ...props.events,
        focusin: (self: Input, evt: Event) => {
          const { value } = evt.target as HTMLInputElement;
          const checkMsg = this.props.check ? this.props.check(value) : '';
          self.setProps({ value, errorMsg: checkMsg });
        },
        focusout: (self: Input, evt: Event) => {
          const { value } = evt.target as HTMLInputElement;
          const checkMsg = this.props.check ? this.props.check(value) : '';
          self.setProps({ value, errorMsg: checkMsg });
        },
      },
    };
    const templator = props.template === InputTemplate.Profile
      ? templateProfile : templateDefault;
    super('div', nextProps, templator);
  }

  componentDidUpdate(oldProps: TInput, newProps: TInput): boolean {
    // перерисовать только когда значение поменялось
    if (newProps.value !== oldProps.value) return true;
    return false;
  }

  render() {
    return this.compile(this.props);
  }
}
