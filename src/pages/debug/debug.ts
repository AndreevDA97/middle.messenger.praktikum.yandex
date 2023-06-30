import template from './debug.hbs';
import templateDebug from '../../partials/_debug.hbs';
import Block, { TProps } from '../../core/Block';
import { withStore } from '../../core/utils/withStore';
import { withRouter } from '../../core/utils/withRouter';

type TDebugPage = {
  title: string,
  description: string,
  debug: boolean,
  _debug?: string
};
class DebugPage extends Block {
  constructor(props: TDebugPage) {
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

export default withRouter(withStore(DebugPage));
