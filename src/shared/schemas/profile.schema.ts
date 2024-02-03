import * as z from 'zod';
import { ERROR_MESSAGE, middlenameSchema, nameSchema, phoneSchema } from './shared.schema';

const emailSchema = z.string().email(ERROR_MESSAGE.incorrect).optional().or(z.literal(''));

export const profileSchema = z.object({
  firstname: nameSchema,
  lastname: nameSchema,
  middlename: middlenameSchema,
  phone: phoneSchema,
  email: emailSchema,
});

export type ProfileSchema = z.infer<typeof profileSchema>;
