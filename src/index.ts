// import HTTPTransport from '../../classes/HTTPTransport';
// import renderDOM from './core/utils/renderDOM';
// импорт всех страниц веб-чата
import DebugPage from './pages/debug/debug';
import ErrorPage from './pages/error/error';
import LoginPage from './pages/login/login';
import RegisterPage from './pages/register/register';
import UserPage from './pages/user/user';
import ChatPage from './pages/chat/chat';
import { Store, AppState, defaultState } from './core/Store';
import Router, { rootRouter } from './core/Router';

declare global {
  interface Window {
    additionalEffects: { create: () => void, clear: () => void };
    store: Store<AppState>;
    router: Router;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const store = new Store<AppState>(defaultState);
  window.store = store;
  store.on('changed', (prevState: Partial<AppState>, nextState: Partial<AppState>) => {
    console.log('Store Changed');
    if (!prevState.appIsInited && nextState.appIsInited) {
      rootRouter
        // страница входа
        .use({
          pathname: '/',
          exact: true,
          block: LoginPage,
          props: {},
          needAuth: false,
        })
        // страница регистрации
        .use({
          pathname: '/register',
          exact: true,
          block: RegisterPage,
          props: {},
          needAuth: false,
        })
        // страница чата
        .use({
          pathname: '/chat',
          exact: true,
          block: ChatPage,
          props: {
            welcome: false,
          },
          needAuth: true,
          redirectPath: '/',
          onUnautorized: () => true,
        })
        // страница пользователя
        .use({
          pathname: '/user',
          exact: false,
          block: UserPage,
          props: {},
          needAuth: true,
          redirectPath: '/',
          onUnautorized: () => true,
        })
        // отладочная страница
        .use({
          pathname: '/debug',
          exact: true,
          block: DebugPage,
          props: {
            title: 'Яндекс Практикум (Спринт 2) - Главная',
            description: 'Просмотр компонентов веб-чата осуществляется по ссылкам ниже, возврат на главную с помощью навигации браузера',
            debug: true,
          },
          needAuth: true,
          redirectPath: '/',
          onUnautorized: () => true,
        })
        // страница ошибки 404
        .use({
          pathname: '/404',
          exact: true,
          block: ErrorPage,
          props: {
            title: 'Ошибка 404',
            description: 'Страница отсутствует',
          },
          needAuth: false,
        })
        // страница ошибки 500
        .use({
          pathname: '/500',
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
  });
  store.dispatch((dispatch) => dispatch({ appIsInited: true }));
});
