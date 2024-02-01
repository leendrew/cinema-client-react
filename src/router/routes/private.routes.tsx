import type { RouteObject } from 'react-router-dom';
import { MainLayout } from '@/shared/ui';
import { MainPage } from '@/pages';
import { WithAuth } from '@/hocs';
import { ROUTER_PATHS } from '@/shared/constants';

export const privateRoutes = {
  index: false,
  element: <WithAuth />,
  children: [
    {
      path: ROUTER_PATHS.main,
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <MainPage />,
        },
      ],
    },
  ],
} satisfies RouteObject;
