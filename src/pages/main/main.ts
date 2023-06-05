import template from './main.hbs';
import templateDebug from '../../partials/_debug.hbs';
import Block, { TProps } from '../../core/Block';

type TMainPage = {
  title: string,
  description: string,
  debug: boolean,
  _debug?: string
};
export default class MainPage extends Block {
  constructor(props: TMainPage) {
    const nextProps = {
      ...props,
    };
    if (props.debug) nextProps._debug = templateDebug({});
    super('main', nextProps, template);
  }

  componentDidUpdate(oldProps: TProps, newProps: TProps) {
    if (oldProps.title !== newProps.title) return true;
    return false;
  }

  render() {
    return this.compile(this.props);
  }
}
