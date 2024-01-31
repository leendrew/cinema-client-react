import type { ApiResponseSuccess, ApiResponseFail } from '@/shared/api';
import type { User, Token } from './auth.store';

interface GetOtpPayload {
  phone: string;
}

interface GetOtpResponseSuccess extends ApiResponseSuccess {
  retryDelay: number;
}

type GetOtpResponse = GetOtpResponseSuccess | ApiResponseFail;

interface LoginPayload {
  phone: string;
  code: number;
}

interface LoginResponseSuccess extends ApiResponseSuccess {
  user: User;
  token: Token;
}

type LoginResponse = LoginResponseSuccess | ApiResponseFail;

interface GetSessionPayload {}

interface GetSessionResponseSuccess extends ApiResponseSuccess {
  user: User;
  token: Token;
}

type GetSessionResponse = GetSessionResponseSuccess | ApiResponseFail;

export const authApi = {};
