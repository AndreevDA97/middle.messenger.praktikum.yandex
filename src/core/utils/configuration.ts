export enum RoutePath {
  Login = '/',
  Register = '/sign-up',
  User = '/settings',
  Chat = '/messenger',
  Error_404 = '/404',
  Error_500 = '/500',
  Debug = '/debug',
}
export const baseUrl = 'https://ya-praktikum.tech/api/v2';
export const wssUrl = 'wss://ya-praktikum.tech/ws/chats';
