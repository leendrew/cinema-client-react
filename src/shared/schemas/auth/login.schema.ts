import * as z from 'zod';
import { ERROR_MESSAGE, phoneSchema } from '../shared.schema';

export const MAX_PHONE_LEN = 11;

export const MAX_OTP_LEN = 6;

const ERROR_MESSAGE_OTP_LEN = `${ERROR_MESSAGE.code} ${MAX_OTP_LEN} цифр`;

export const codeSchema = z
  .string({ required_error: ERROR_MESSAGE.required })
  .min(MAX_OTP_LEN, ERROR_MESSAGE_OTP_LEN);

export const getOtpSchema = z.object({
  phone: phoneSchema,
});

export const loginSchema = z.object({
  phone: phoneSchema,
  code: codeSchema,
});

export type LoginSchema = z.infer<typeof loginSchema>;
