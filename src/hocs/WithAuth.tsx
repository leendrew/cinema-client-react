import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function WithAuth() {
  const location = useLocation();

  // TODO: Auth STM
  const isAuth = true;

  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
