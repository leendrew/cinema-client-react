import * as z from 'zod';

export const ERROR_MESSAGE_REQUIRED = 'Поле является обязательным';
export const ERROR_MESSAGE_CODE = 'Код должен содержать';
export const ERROR_MESSAGE_COMBINATION_ALPHABET =
  'Значение должно быть задано с использованием одного из следующих алфавитов: кириллического, латинского';
export const ERROR_MESSAGE_DIFFERENT_ALPHABET = 'Значения заданы с использованием разных алфавитов';
export const ERROR_MESSAGE_INCORRECT_FORMAT = 'Некорректный формат';

export const MAX_NAME_LEN = 60;

// export const login = z
//   .string({
//     required_error: ERROR_MESSAGE_REQUIRED,
//   })
//   .min(MIN_LENGTH_LOGIN, `${ERROR_MESSAGE_SHORT} ${MIN_LENGTH_LOGIN}`);

// export const password = z
//   .string({
//     required_error: ERROR_MESSAGE_REQUIRED,
//   })
//   .min(MIN_LENGTH_PASSWORD, `${ERROR_MESSAGE_SHORT} ${MIN_LENGTH_PASSWORD}`);
