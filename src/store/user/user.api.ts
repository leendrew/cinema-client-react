import { axios } from '@/config';
import type { ApiResponseSuccess } from '@/config';

export interface User {
  phone: string;
  firstname?: string;
  middlename?: string;
  lastname?: string;
  email?: string;
}

interface GetSessionResponseSuccess extends ApiResponseSuccess {
  user: User;
}

export interface UpdateProfilePayload {
  phone: string;
  profile: Omit<User, 'phone'>;
}

interface UpdateProfileResponseSuccess extends ApiResponseSuccess {}

export const userApi = {
  getSession() {
    return axios.get<GetSessionResponseSuccess>('/users/session');
  },
  updateProfile(payload: UpdateProfilePayload) {
    return axios.patch<UpdateProfileResponseSuccess>('/users/profile', payload);
  },
};
