type TRegexRules = {
  NAME_REGEX: RegExp,
  LOGIN_REGEX: RegExp,
  EMAIL_REGEX: RegExp,
  PASSWORD_REGEX: RegExp,
  PHONE_REGEX: RegExp,
  MESSAGE_REGEX: RegExp
};
export const RegexRules: TRegexRules = {
  // латиница или кириллица, первая буква должна быть заглавной,
  // без пробелов и без цифр, нет спецсимволов (допустим только дефис)
  NAME_REGEX: /^[A-ZА-ЯЁ][-a-zа-яё]+$/,
  // от 3 до 20 символов, латиница, может содержать цифры, но не состоять из них,
  // без пробелов, без спецсимволов (допустимы дефис и нижнее подчёркивание)
  LOGIN_REGEX: /^[A-Za-z][-_0-9A-Za-z]{2,19}$/,
  // латиница, может включать цифры и спецсимволы вроде дефиса, обязательно должна быть «собака» (@)
  // и точка после неё, но перед точкой обязательно должны быть буквы
  EMAIL_REGEX: /^[-_.A-Za-z0-9]+@[-.a-z0-9]+\.[a-z.]{2,}$/,
  // от 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра
  PASSWORD_REGEX: /^(?=.*[0-9])(?=.*[A-Z]).{8,40}$/,
  // от 10 до 15 символов, состоит из цифр, может начинается с плюса
  PHONE_REGEX: /^\+?[0-9]{9,14}$/,
  // не должно быть пустым
  MESSAGE_REGEX: /^.+$/,
};
export default function validate(regExp: RegExp, value: string): boolean {
  return regExp.test(value);
}
