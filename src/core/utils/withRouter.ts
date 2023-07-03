import { BlockClass } from '../Block';
import Router, { rootRouter } from '../Router';

export type WithRouterProps = { router?: Router };

// eslint-disable-next-line import/prefer-default-export
export function withRouter<P extends WithRouterProps>(WrappedBlock: BlockClass<P>) {
  // @ts-expect-error No base constructor has the specified number of type arguments
  return class extends WrappedBlock<P> {
    public static componentName = WrappedBlock.componentName || WrappedBlock.name;

    constructor(props: P) {
      super({ ...props, router: rootRouter });
    }
  } as BlockClass<Omit<P, 'router'>>;
}
