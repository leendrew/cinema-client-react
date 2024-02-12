import * as z from 'zod';

export const ERROR_MESSAGE = {
  api: 'Произошла ошибка',
  required: 'Поле является обязательным',
  codeBase: 'Код должен содержать',
  combinationAlphabet:
    'Значение должно быть задано с использованием одного из следующих алфавитов: кириллического, латинского',
  differentAlphabet: 'Значения заданы с использованием разных алфавитов',
  incorrect: 'Поле заполнено некорректно',
  incorrectFormat: 'Некорректный формат',
  maxNameLenBase: 'Поле не может быть больше',
};

export const MAX_NAME_LEN = 60;

export const ERROR_MESSAGE_MAX_NAME_LEN = `${ERROR_MESSAGE.maxNameLenBase} ${MAX_NAME_LEN} символов`;

export const phoneSchema = z
  .string({ required_error: ERROR_MESSAGE.required })
  .refine(
    (value) => /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/.test(value),
    ERROR_MESSAGE.incorrect,
  );
export const nameSchema = z
  .string({ required_error: ERROR_MESSAGE.required })
  .min(1, ERROR_MESSAGE.required)
  .max(MAX_NAME_LEN, ERROR_MESSAGE_MAX_NAME_LEN);
export const middlenameSchema = z.string().max(MAX_NAME_LEN, ERROR_MESSAGE_MAX_NAME_LEN);

const serializeDataRules = {
  /**
   * '+7 999 888 77 66' -> '79998887766'
   */
  phone: (value: string) => value.replace(/[^\d.-]+/g, ''),
  /**
   * '123456' -> 123456
   */
  code: (value: string) => parseInt(value, 10),
};

// TODO: refactor typing
export const serializeData = (data: object) =>
  Object.entries(data).reduce((acc, [key, value]) => {
    // @ts-expect-error object keys
    const serializeFn = serializeDataRules[key];
    if (!serializeFn) {
      // @ts-expect-error object keys
      acc[key] = value;

      return acc;
    }

    // @ts-expect-error object keys
    acc[key] = serializeFn(value);

    return acc;
  }, {});
