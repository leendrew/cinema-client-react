import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import type { AxiosError } from 'axios';
import { ERROR_MESSAGE } from '@/shared/schemas';
import type { ApiResponseFail } from './api.config';

const toastErrorHandler = (error: AxiosError<ApiResponseFail>) => {
  const message = error.response?.data.reason || ERROR_MESSAGE.api;
  toast.error(message);
};

export const queryConfig = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      console.log('@error query', error);
      toastErrorHandler(error as AxiosError<ApiResponseFail>);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      console.log('@error mutation', error);
      toastErrorHandler(error as AxiosError<ApiResponseFail>);
    },
  }),
});
