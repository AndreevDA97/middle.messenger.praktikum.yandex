import template from './error.hbs';
import Block from '../../core/Block';
import { withStore } from '../../core/utils/withStore';
import { withRouter } from '../../core/utils/withRouter';

type TErrorPage = {
  title: string,
  description: string
};
class ErrorPage extends Block {
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

export default withRouter(withStore(ErrorPage));
