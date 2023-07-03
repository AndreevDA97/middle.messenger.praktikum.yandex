import { Store, rootStore, AppState } from '../core/Store';
import Router, { rootRouter } from '../core/Router';

export default class BaseController {
  public router: Router = rootRouter;

  public store: Store<AppState> = rootStore;
}
