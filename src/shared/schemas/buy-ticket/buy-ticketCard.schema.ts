import * as z from 'zod';
import { ERROR_MESSAGE } from '..';

export const buyTicketCardSchema = z.object({
  pan: z
    .string({ required_error: ERROR_MESSAGE.required })
    .min(1, ERROR_MESSAGE.required)
    .refine((value) => /^\d{4} \d{4}$/.test(value), ERROR_MESSAGE.incorrect),
  expireDate: z
    .string({ required_error: ERROR_MESSAGE.required })
    .min(1, ERROR_MESSAGE.required)
    .refine((value) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(value), ERROR_MESSAGE.incorrect),
  cvv: z
    .string({ required_error: ERROR_MESSAGE.required })
    .min(1, ERROR_MESSAGE.required)
    .refine((value) => /^[0-9]{3,4}$/.test(value), ERROR_MESSAGE.incorrect),
});

export type BuyTicketCardSchema = z.infer<typeof buyTicketCardSchema>;
