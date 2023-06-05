import template from './error.hbs';
import Block from '../../core/Block';

type TErrorPage = {
  title: string,
  description: string
};
export default class ErrorPage extends Block {
  constructor(props: TErrorPage) {
    const nextProps = {
      ...props,
    };
    super('div', nextProps, template);
  }

  render() {
    return this.compile(this.props);
  }
}
