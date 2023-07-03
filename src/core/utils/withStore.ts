import { BlockClass } from '../Block';
import { Store, AppState, StoreEvents, rootStore } from '../Store';

export type WithStateProps = { store?: Store<AppState> };

// eslint-disable-next-line import/prefer-default-export
export function withStore<P extends WithStateProps>(WrappedBlock: BlockClass<P>) {
  // @ts-expect-error No base constructor has the specified
  return class extends WrappedBlock<P> {
    constructor(props: P) {
      super({ ...props, store: rootStore });
    }

    __onChangeStoreCallback = () => {
      // @ts-expect-error this is not typed
      this.setProps({ ...this.props, store: rootStore });
    };

    componentDidMount(props: P) {
      super.componentDidMount(props);
      rootStore.on(StoreEvents.Changed, this.__onChangeStoreCallback);
    }

    componentWillUnmount() {
      super.componentWillUnmount();
      rootStore.off(StoreEvents.Changed, this.__onChangeStoreCallback);
    }
  } as BlockClass<Omit<P, 'store'>>;
}
