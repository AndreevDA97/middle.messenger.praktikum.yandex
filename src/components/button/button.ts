import template from './button.hbs';
import Block from '../../core/Block';

export enum ButtonType {
  Button = 'button',
  Submit = 'submit',
}
export type TButton = {
  title: string,
  type?: ButtonType,
  events?: Record<string, Function>
};
export default class Button extends Block {
  constructor(props: TButton) {
    const nextProps = {
      ...props,
    };
    super('div', nextProps, template);
  }

  render() {
    return this.compile(this.props);
  }
}
