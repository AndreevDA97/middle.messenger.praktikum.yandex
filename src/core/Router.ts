import Route from './Route';
import { BlockClass } from './Block';
import { RoutePath } from './utils/configuration';

type TRouteConstructor = {
  pathname: string,
  block: BlockClass,
  props: any,
  exact: boolean,
  needAuth: boolean,
  notFound: boolean,
  redirectPath: string,
  onUnautorized: () => boolean,
  onAutorized: () => boolean
};

export default class Router {
  private static __instance: Router;

  public history: History;

  private routes: Route[];

  private _currentRoute: Route;

  private _rootQuery: string;

  constructor(rootQuery: string) {
    if (Router.__instance) {
      // eslint-disable-next-line no-constructor-return
      return Router.__instance;
    }

    this.routes = [];
    this.history = window.history;
    this._rootQuery = rootQuery;

    Router.__instance = this;
  }

  static getInstance() {
    return this.__instance;
  }

  use({
    pathname,
    block,
    props = {},
    exact = true,
    needAuth = false,
    notFound = false,
    onUnautorized,
    onAutorized,
    redirectPath }
  : Partial<TRouteConstructor>) {
    const redirect = () => (redirectPath ? this.go(redirectPath) : null);
    const route = new Route(
      pathname || '',
      { rootQuery: this._rootQuery, exact },
      block,
      props,
      needAuth,
      notFound,
      onUnautorized,
      onAutorized,
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
    const route = this.getRoute(pathname)
        || this.routes.find((r) => r.isNotFound());
    if (!route) {
      return;
    }
    this._currentRoute?.leave();
    this._currentRoute = route;
    route.render();
  }

  go(pathname: string | RoutePath) {
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

  getCurrentRoute(): Route {
    return this._currentRoute;
  }
}

export const rootRouter = new Router('#app');
