import { axios } from '@/config';
import type { ApiResponseSuccess } from '@/config';
import type { Token } from './auth.store';
import type { User } from '../user';

export interface GetOtpPayload {
  phone: string;
}

interface GetOtpResponse extends ApiResponseSuccess {
  retryDelay: number;
}

export interface LoginPayload {
  phone: string;
  code: number;
}

interface LoginResponse extends ApiResponseSuccess {
  user: User;
  token: Token;
}

export const authApi = {
  getOtp(payload: GetOtpPayload) {
    return axios.post<GetOtpResponse>('/auth/otp', payload);
  },
  login(payload: LoginPayload) {
    return axios.post<LoginResponse>('/users/signin', payload);
  },
};
