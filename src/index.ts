import Block from './core/Block';
import renderDOM from './core/utils/renderDOM';
// import HTTPTransport from '../../classes/HTTPTransport';
import MainPage from './pages/main/main';
import ErrorPage from './pages/error/error';
import LoginPage from './pages/login/login';
import RegisterPage from './pages/register/register';

window.addEventListener('DOMContentLoaded', () => {
  // главная страница
  const mainPage = new MainPage({
    title: 'Яндекс Практикум (Спринт 2) - Главная',
    description: 'Просмотр макета веб-чата осуществляется по ссылкам ниже, возврат на главную с помощью навигации браузера',
    debug: true,
  });
  // страница ошибки 404
  const notFoundPage = new ErrorPage({
    title: 'Ошибка 404',
    description: 'Страница отсутствует',
  });
  // страница ошибки 500
  const serverErrorPage = new ErrorPage({
    title: 'Ошибка 500',
    description: 'Временно недоступен',
  });

  // страница входа
  const loginPage = new LoginPage();
  // страница регистрации
  const registerPage = new RegisterPage();
  // страница чата
  const chatPage = new Block();
  // страница пользователя
  const userPage = new Block();

  // маршрутизация по адресу в рамках SPA
  switch (window.location.pathname) {
    case '/404': renderDOM(notFoundPage); break;
    case '/500': renderDOM(serverErrorPage); break;
    case '/login': renderDOM(loginPage); break;
    case '/register': renderDOM(registerPage); break;
    case '/chat': renderDOM(chatPage); break;
    case '/user': renderDOM(userPage); break;
    default: renderDOM(mainPage);
  }
});
