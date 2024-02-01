import { Header } from '@/components';
import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';

export function MainLayout() {
  return (
    <>
      <Header />
      <Container
        sx={{
          paddingTop: '3rem',
        }}
      >
        <Outlet />
      </Container>
    </>
  );
}
