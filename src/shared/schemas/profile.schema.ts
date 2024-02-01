import * as z from 'zod';
import { ERROR_MESSAGE, MAX_NAME_LEN, phoneSchema } from './shared.schema';

const ERROR_MESSAGE_MAX_NAME_LEN = `${ERROR_MESSAGE.maxNameLen} ${MAX_NAME_LEN} символов`;

const nameSchema = z
  .string({ required_error: ERROR_MESSAGE.required })
  .max(MAX_NAME_LEN, ERROR_MESSAGE_MAX_NAME_LEN);

const middlenameSchema = z.string().max(MAX_NAME_LEN, ERROR_MESSAGE_MAX_NAME_LEN);

const emailSchema = z
  .string({ required_error: ERROR_MESSAGE.required })
  .email(ERROR_MESSAGE.incorrect);

export const profileSchema = z.object({
  firstname: nameSchema,
  lastname: nameSchema,
  middlename: middlenameSchema,
  phone: phoneSchema,
  email: emailSchema,
});

export type ProfileSchema = z.infer<typeof profileSchema>;