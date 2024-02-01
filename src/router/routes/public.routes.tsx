import type { RouteObject } from 'react-router-dom';
import { MainLayout } from '@/shared/ui';
import { LoginPage, MainPage } from '@/pages';
import { ROUTER_PATHS } from '@/shared/constants';

export const publicRoutes = {
  index: false,
  element: <MainLayout />,
  children: [
    {
      path: ROUTER_PATHS.auth.login,
      element: <LoginPage />,
    },
    {
      path: ROUTER_PATHS.main,
      element: <MainPage />,
    },
  ],
} satisfies RouteObject;
