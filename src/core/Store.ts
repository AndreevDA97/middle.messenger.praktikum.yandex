import EventBus from './EventBus';

export const defaultState: AppState = {
  appIsInited: false,
  loginFormError: null,
  user: null,
};

export interface AppState {
  appIsInited: boolean;
  loginFormError: string | null;
  user: object | null;
}

export type Dispatch<State> = (
  nextStateOrAction: Partial<State> | Action<State>,
  payload?: any,
) => void;

export type Action<State> = (
  dispatch: Dispatch<State>,
  state: State,
  payload: any,
) => void;

export class Store<State extends Record<string, any>> extends EventBus {
  private state: State = {} as State;

  constructor(state: State) {
    super();

    this.state = state;
    this.set(state);
  }

  public getState() {
    return this.state;
  }

  public set(nextState: Partial<State>) {
    const prevState = { ...this.state };

    this.state = { ...this.state, ...nextState };

    this.emit('changed', prevState, nextState);
  }

  dispatch(nextStateOrAction: Partial<State> | Action<State>, payload?: any) {
    if (typeof nextStateOrAction === 'function') {
      nextStateOrAction(this.dispatch.bind(this), this.state, payload);
    } else {
      this.set({ ...this.state, ...nextStateOrAction });
    }
  }
}
