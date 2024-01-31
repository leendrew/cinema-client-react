import { envConfig } from '@/config';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface User {
  phone: string;
  firstname: string;
  middlename: string;
  lastname: string;
  email: string;
  city: string;
}

export type Token = string;

interface AuthState {
  user: User | null;
  token: Token | null;
  isAuth: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuth: true,
};

interface AuthActions {
  reset: () => void;
  setState: (state: Partial<AuthState>) => void;
  logout: () => void;
}

export const authStore = create<AuthState>()(
  devtools(
    persist(() => initialState, { name: 'cinema/ls' }),
    { name: 'auth', enabled: envConfig.isDev },
  ),
);

export const authActions: AuthActions = {
  reset: () => authStore.setState(() => initialState, false, 'reset'),
  setState: (incomingState) => authStore.setState(() => ({ ...incomingState }), false, 'setState'),
  logout: () => authActions.reset(),
};
