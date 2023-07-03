import Block, { BlockClass } from './Block';
import renderDOM from './utils/renderDOM';

function isEqual(lhs: any, rhs: any) {
  return lhs === rhs;
}

export interface IRouterProps {
  rootQuery: string;
  exact: boolean;
}

export default class Route {
  private readonly _pathname: string;

  private _blockClass?: BlockClass;

  private _block: Block;

  private _props: IRouterProps;

  private _componentProps: any;

  // @ts-ignore
  private _params: {};

  private _needAuth: boolean;

  private _notFound: boolean;

  private _onUnautorized: any;

  private _redirect: () => void;

  constructor(
    pathname: string,
    props: IRouterProps,
    componentView: BlockClass | undefined,
    componentProps: any,
    needAuth: boolean = false,
    notFound: boolean = false,
    onUnautorized?: () => boolean,
    redirect: () => void = () => {},
  ) {
    this._pathname = pathname;
    this._props = props;
    this._blockClass = componentView;
    this._componentProps = componentProps;
    this._needAuth = needAuth;
    this._notFound = notFound;
    this._onUnautorized = onUnautorized;
    this._params = this.getParams();
    this._redirect = redirect;
  }

  // eslint-disable-next-line class-methods-use-this
  public getParams(): {} {
    return Object.fromEntries((new URLSearchParams(document.location.search)).entries());
  }

  // eslint-disable-next-line class-methods-use-this
  public getFullPath(): string {
    let fullPath = window.location.pathname;
    if (fullPath.slice(-1) === '/') fullPath = fullPath.slice(0, -1);
    return fullPath;
  }

  public getPath(): string {
    return this._pathname;
  }

  leave() {
    this._block?.destroy();
  }

  match(pathname: string) {
    if (this._props.exact) {
      return isEqual(pathname, this._pathname);
    }
    return pathname.indexOf(this._pathname) >= 0;
  }

  checkAuth() {
    if (this._needAuth) {
      if (typeof this._onUnautorized === 'function') {
        return this._onUnautorized(this._pathname);
      }
    }
    return true;
  }

  isNotFound() {
    return this._notFound;
  }

  render() {
    if (this.checkAuth() && this._blockClass) {
      this._block = new this._blockClass({
        ...this._componentProps,
        routerParams: this.getParams(),
      });
      renderDOM(this._block, this._props.rootQuery);
    } else {
      this._redirect();
    }
  }
}
