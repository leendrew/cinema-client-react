import Axios from 'axios';
import { envConfig } from './env.config';
import { authStore } from '@/store';

export const axios = Axios.create({
  baseURL: envConfig.apiUrl,
});

axios.interceptors.request.use((config) => {
  const authState = authStore.getState();
  if (authState.token) {
    config.headers.Authorization = `Bearer ${authState.token}`;
  }

  return config;
});

export interface ApiResponseSuccess {
  success: true;
}

export interface ApiResponseFail {
  success: false;
  reason: string;
}
