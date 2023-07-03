import EventBus from './EventBus';
import { cloneDeep, merge } from './utils/extensions';

export function getDefaultState(): AppState {
  return {
    isAppInit: false,
    isLoading: false,
    isAuth: false,
    user: null,
    chats: null,
    loginError: null,
    registerError: null,
    userEditError: null,
    userPasswordEditError: null,
    userAvatarEditError: null,
  };
}
export const defaultState: AppState = getDefaultState();

export type Chat = Record<string, number | string | unknown>;
export interface AppState {
  isAppInit: boolean,
  isLoading: boolean,
  isAuth: boolean,
  user: Record<string, string | number> | null,
  chats: Array<Chat> | null,
  currentChat?: {
    isLoading: boolean,
    isLoadingOldMsg: boolean,
    scroll: number,
    chat: null | Chat,
    messages: Array<Chat> | null,
  } | any,
  loginError: string | null;
  registerError: string | null;
  userEditError: string | null;
  userPasswordEditError: string | null;
  userAvatarEditError: string | null;
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

export enum StoreEvents {
  Changed = 'changed',
}

export class Store<State extends AppState> extends EventBus {
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
    const prevState = cloneDeep(this.state);

    this.state = merge(this.state, nextState) as State;

    this.emit(StoreEvents.Changed, prevState, nextState);
  }

  dispatch(nextStateOrAction: Partial<State> | Action<State>, payload?: any) {
    if (typeof nextStateOrAction === 'function') {
      nextStateOrAction(this.dispatch.bind(this), this.state, payload);
    } else {
      this.set(merge(cloneDeep(this.state), nextStateOrAction) as State);
    }
  }
}

export const rootStore = new Store<AppState>(defaultState);
