import { Outlet } from 'react-router-dom';
import { Header } from '@/components';
import { Container } from '@mui/material';

export function MainLayout() {
  return (
    <>
      <Header />
      <Container
        component="main"
        sx={{
          paddingTop: '3rem',
          paddingBottom: '3rem',
        }}
      >
        <Outlet />
      </Container>
    </>
  );
}
