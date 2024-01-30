import { Header } from '@/components';
import { Outlet } from 'react-router-dom';

export function MainLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
