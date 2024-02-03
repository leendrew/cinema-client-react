import * as z from 'zod';
import { middlenameSchema, nameSchema, phoneSchema } from '../shared.schema';

export const buyTicketPersonSchema = z.object({
  firstname: nameSchema,
  lastname: nameSchema,
  middlename: middlenameSchema,
  phone: phoneSchema,
});

export type BuyTicketPersonSchema = z.infer<typeof buyTicketPersonSchema>;
