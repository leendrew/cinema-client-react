import type { RouteObject } from 'react-router-dom';
import { MainLayout } from '@/shared/ui';
import { ProfilePage } from '@/pages';
import { WithAuth } from '@/hocs';
import { ROUTER_PATHS } from '@/shared/constants';

export const privateRoutes = {
  index: false,
  element: <WithAuth />,
  children: [
    {
      path: ROUTER_PATHS.profile,
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <ProfilePage />,
        },
      ],
    },
  ],
} satisfies RouteObject;
