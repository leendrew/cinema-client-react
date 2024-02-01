import { useQuery } from '@tanstack/react-query';
import { CircularProgress } from '@mui/material';
import { userApi } from '@/store';
import { Navigate } from 'react-router-dom';
import { ROUTER_PATHS } from '@/shared/constants';
import { Profile } from '@/components/profile';

// TODO: refactor this shit

export function ProfilePage() {
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: userApi.getSession,
  });

  // TODO: skeleton
  if (userQuery.isLoading) {
    return (
      <>
        <CircularProgress />
      </>
    );
  }

  const user = userQuery.data?.data.user;

  if (!user) {
    return <Navigate to={ROUTER_PATHS.main} />;
  }

  return (
    <>
      <Profile user={user} />
    </>
  );
}
