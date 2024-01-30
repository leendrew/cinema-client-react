import { createBrowserRouter, createHashRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { envConfig } from '@/config';
import { MainLayout } from '@ui';
import { HomePage, LoginPage } from '@/pages';
import { WithAuth } from '@/hocs';

const privateRoutes = {
  index: false,
  element: <WithAuth />,
  children: [
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
      ],
    },
  ],
} satisfies RouteObject;

const routes = [
  privateRoutes,
  {
    index: false,
    element: <MainLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },
] satisfies RouteObject[];

export const router = envConfig.isDev ? createBrowserRouter(routes) : createHashRouter(routes);
