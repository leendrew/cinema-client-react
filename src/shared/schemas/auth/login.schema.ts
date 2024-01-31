import * as z from 'zod';

export const phoneSchema = z.object({});

export const otpSchema = z.object({});

export const loginSchema = z.object({
  phone: phoneSchema,
  otp: otpSchema,
});
