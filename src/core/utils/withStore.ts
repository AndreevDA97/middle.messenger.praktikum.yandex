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

    _onChangeStoreCallback = (oldProps: P, newProps: Partial<P>) => {
      if (this.onChangeStoreCallback(oldProps, newProps)) {
        // @ts-expect-error this is not typed
        this.setProps({ ...this.props, store: rootStore });
      }
    };

    // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars
    public onChangeStoreCallback(_oldProps: P, _newProps: Partial<P>): boolean {
      return true;
    }

    componentDidMount(props: P) {
      super.componentDidMount(props);
      rootStore.on(StoreEvents.Changed, this._onChangeStoreCallback);
    }

    componentWillUnmount() {
      super.componentWillUnmount();
      rootStore.off(StoreEvents.Changed, this._onChangeStoreCallback);
    }
  } as BlockClass<Omit<P, 'store'>>;
}
