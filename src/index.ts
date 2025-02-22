// import HTTPTransport from '../../classes/HTTPTransport';
// import renderDOM from './core/utils/renderDOM';
// импорт всех страниц веб-чата
import DebugPage from './pages/debug/debug';
import ErrorPage from './pages/error/error';
import LoginPage from './pages/login/login';
import RegisterPage from './pages/register/register';
import UserPage from './pages/user/user';
import ChatPage from './pages/chat/chat';
import { Store, AppState, StoreEvents, rootStore } from './core/Store';
import Router, { rootRouter } from './core/Router';
import { RoutePath } from './core/utils/configuration';
import AuthController from './controllers/AuthController';
import '../static/styles/stylesheet.scss';
import './additional';

declare global {
  interface Window {
    additionalEffects: {
      create: (onModalHide?: () => void) => void,
      clear: () => void
    };
    store: Store<AppState>;
    router: Router;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // инициализация SPA
  rootStore.on(
    StoreEvents.Changed,
    (prevState: Partial<AppState>, nextState: Partial<AppState>) => {
      if (!prevState.isAppInit && nextState.isAppInit) {
        rootRouter
          // страница входа
          .use({
            pathname: RoutePath.Login,
            exact: true,
            block: LoginPage,
            props: {},
            needAuth: false,
            onAutorized: () => rootStore.getState().isAuth,
            redirectPath: RoutePath.Chat,
          })
          // страница регистрации
          .use({
            pathname: RoutePath.Register,
            exact: true,
            block: RegisterPage,
            props: {},
            needAuth: false,
            onAutorized: () => rootStore.getState().isAuth,
            redirectPath: RoutePath.Chat,
          })
          // страница чата
          .use({
            pathname: RoutePath.Chat,
            exact: true,
            block: ChatPage,
            props: {},
            needAuth: true,
            onUnautorized: () => rootStore.getState().isAuth,
            redirectPath: RoutePath.Login,
          })
          // страница пользователя
          .use({
            pathname: RoutePath.User,
            exact: false,
            block: UserPage,
            props: {},
            needAuth: true,
            onUnautorized: () => rootStore.getState().isAuth,
            redirectPath: RoutePath.Login,
          })
          // отладочная страница
          .use({
            pathname: RoutePath.Debug,
            exact: true,
            block: DebugPage,
            props: {
              title: 'Яндекс Практикум (Спринт 2) - Главная',
              description: 'Просмотр компонентов веб-чата осуществляется по ссылкам ниже, возврат на главную с помощью навигации браузера',
              debug: true,
            },
            needAuth: false,
          })
          // страница ошибки 404
          .use({
            pathname: RoutePath.Error_404,
            exact: true,
            block: ErrorPage,
            props: {
              title: 'Ошибка 404',
              description: 'Страница отсутствует',
            },
            needAuth: false,
            notFound: true,
          })
          // страница ошибки 500
          .use({
            pathname: RoutePath.Error_500,
            exact: true,
            block: ErrorPage,
            props: {
              title: 'Ошибка 500',
              description: 'Временно недоступен',
            },
            needAuth: false,
          })
          .start();
      }
    },
  );
  rootStore.dispatch((dispatch) => {
    AuthController.getUserInfo().finally(() => {
      dispatch({ isAppInit: true });
    });
  });

  // глобальные объекты для шаблонов hbs
  window.router = rootRouter;
  window.store = rootStore;
});
