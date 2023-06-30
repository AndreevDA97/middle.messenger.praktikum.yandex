import Route from './Route';
import { BlockClass } from './Block';

type TRouteConstructor = {
  pathname: string,
  block: BlockClass,
  props: any,
  exact: boolean,
  needAuth: boolean,
  redirectPath: string,
  onUnautorized: () => boolean
};

export default class Router {
  private static __instance: Router;

  public history: History;

  private routes: Route[];

  private _currentRoute: Route;

  private _rootQuery: string;

  constructor(rootQuery: string) {
    // if (PathRouter.__instance) {
    //     return PathRouter.__instance;
    // }

    this.routes = [];
    this.history = window.history;
    this._rootQuery = rootQuery;

    // PathRouter.__instance = this;
  }

  static getInstance() {
    return this.__instance;
  }

  use(
    { pathname, block, props = {}, exact = true, needAuth = false, onUnautorized, redirectPath }
    : Partial<TRouteConstructor>,
  ) {
    const redirect = () => (redirectPath ? this.go(redirectPath) : null);
    const route = new Route(
      pathname || '',
      { rootQuery: this._rootQuery, exact },
      block,
      props,
      needAuth,
      onUnautorized,
      redirect,
    );
    this.routes.push(route);
    return this;
  }

  start() {
    window.onpopstate = (event: any) => {
      this._onRoute(event.currentTarget?.location.pathname);
    };
    this._onRoute(window.location.pathname);
  }

  _onRoute(pathname: string) {
    const route = this.getRoute(pathname);
    if (!route) {
      return;
    }
    this._currentRoute?.leave();
    this._currentRoute = route;
    route.render();
  }

  go(pathname: string) {
    this.history.pushState({}, '', pathname);
    this._onRoute(pathname);
  }

  back() {
    this.history.go(-1);
  }

  forward() {
    this.history.go(1);
  }

  getRoute(pathname: string) {
    return this.routes.find((route) => route.match(pathname));
  }
}

export const rootRouter = new Router('#app');
