import type { RouteObject } from 'react-router-dom';
import { MainLayout } from '@/shared/ui';
import { ProfilePage, TicketsPage } from '@/pages';
import { WithAuth } from '@/hocs';
import { ROUTER_PATHS } from '@/shared/constants';

export const privateRoutes = {
  element: <WithAuth />,
  children: [
    {
      element: <MainLayout />,
      children: [
        {
          path: ROUTER_PATHS.profile,
          element: <ProfilePage />,
        },
        {
          path: ROUTER_PATHS.tickets,
          element: <TicketsPage />,
        },
      ],
    },
  ],
} satisfies RouteObject;
