import { Link } from 'react-router-dom';
import { Box, Container, Stack } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { authStore, authActions } from '@/store';
import { ROUTER_PATHS } from '@/shared/constants';
import { Button, LogoIcon } from '@/shared/ui';

export function Header() {
  const isAuth = authStore((state) => state.isAuth);

  const onLogoutClick = () => authActions.logout();

  return (
    <>
      <Box
        component="header"
        sx={{
          // TODO: CSS vars
          height: '5.125rem',
          borderBottom: '0.0625rem solid #CED2DA',
        }}
      >
        <Container sx={{ height: '100%' }}>
          <Stack sx={{ height: '100%' }} direction="row" alignItems="center" gap={4}>
            <Link to={ROUTER_PATHS.main}>
              <Box sx={{ width: 102, height: 39 }}>
                <LogoIcon style={{ width: '100%', height: '100%' }} />
              </Box>
            </Link>
            {isAuth && (
              <>
                <Link to={ROUTER_PATHS.profile}>
                  <Button>Профиль</Button>
                </Link>
                <Link to={ROUTER_PATHS.tickets}>
                  <Button>Билеты</Button>
                </Link>
              </>
            )}
            <Box
              sx={{
                marginLeft: 'auto',
              }}
            >
              {isAuth && (
                <Link to={ROUTER_PATHS.auth.login}>
                  <Button variant="text" startIcon={<LogoutIcon />} onClick={onLogoutClick}>
                    Выйти
                  </Button>
                </Link>
              )}
              {!isAuth && (
                <Link to={ROUTER_PATHS.auth.login}>
                  <Button variant="text">Войти</Button>
                </Link>
              )}
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
