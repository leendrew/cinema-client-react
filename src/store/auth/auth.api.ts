import { axios } from '@/config';
import type { ApiResponseSuccess } from '@/config';
import type { Token } from './auth.store';
import type { User } from '../user';

export interface GetOtpPayload {
  phone: string;
}

interface GetOtpResponseSuccess extends ApiResponseSuccess {
  retryDelay: number;
}

export interface LoginPayload {
  phone: string;
  code: number;
}

interface LoginResponseSuccess extends ApiResponseSuccess {
  user: User;
  token: Token;
}

export const authApi = {
  getOtp(payload: GetOtpPayload) {
    return axios.post<GetOtpResponseSuccess>('/auth/otp', payload);
  },
  login(payload: LoginPayload) {
    return axios.post<LoginResponseSuccess>('/users/signin', payload);
  },
};
