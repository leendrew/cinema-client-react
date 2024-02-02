import { axios } from '@/config';
import type { ApiResponseSuccess } from '@/config';

export interface User {
  phone: string;
  firstname?: string;
  middlename?: string;
  lastname?: string;
  email?: string;
}

interface GetSessionResponse extends ApiResponseSuccess {
  user: User;
}

export interface UpdateProfilePayload {
  phone: string;
  profile: Omit<User, 'phone'>;
}

interface UpdateProfileResponse extends ApiResponseSuccess {}

export const userApi = {
  getSession() {
    return axios.get<GetSessionResponse>('/users/session');
  },
  updateProfile(payload: UpdateProfilePayload) {
    return axios.patch<UpdateProfileResponse>('/users/profile', payload);
  },
};
