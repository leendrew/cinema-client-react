import { Link } from 'react-router-dom';
import { Box, Container, Stack } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { authStore, authActions } from '@/store/auth';
import { ROUTER_PATHS } from '@/shared/constants';
import { Button } from '@/shared/ui/button';
import { LogoIcon } from '@/shared/ui/icons';

export function Header() {
  const isAuth = authStore((state) => state.isAuth);

  const onLogoutClick = () => authActions.logout();

  return (
    <>
      <Box
        component="header"
        sx={{
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
              <Box
                sx={{
                  marginLeft: 'auto',
                }}
              >
                <Link to={ROUTER_PATHS.auth.login}>
                  <Button variant="text" startIcon={<LogoutIcon />} onClick={onLogoutClick}>
                    Выйти
                  </Button>
                </Link>
              </Box>
            )}
            {!isAuth && (
              <>
                <Link to={ROUTER_PATHS.profile}>
                  <Button>Профиль</Button>
                </Link>
                <Link to={ROUTER_PATHS.profile}>
                  <Button>Билеты</Button>
                </Link>
              </>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
}
