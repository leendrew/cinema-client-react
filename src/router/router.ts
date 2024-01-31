import { createBrowserRouter, createHashRouter } from 'react-router-dom';
import { envConfig } from '@/config';
import { publicRoutes, privateRoutes } from './routes';

const routes = [publicRoutes, privateRoutes];

export const router = envConfig.isDev ? createBrowserRouter(routes) : createHashRouter(routes);
