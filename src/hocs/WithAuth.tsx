import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authStore } from '@/store';

export function WithAuth() {
  const location = useLocation();

  const isAuth = authStore((state) => state.isAuth);

  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
