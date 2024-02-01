import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { moviesApi } from '@/store';
import { MovieCard } from '@/components';
import { ROUTER_PATHS_DYNAMIC } from '@/shared/constants';

// TODO: refactor this shit

export function MainPage() {
  const navigate = useNavigate();
  const todayMoviesQuery = useQuery({
    queryKey: ['todayMovies'],
    queryFn: moviesApi.getTodayMovies,
  });

  if (todayMoviesQuery.isLoading) {
    return (
      <>
        <CircularProgress />
      </>
    );
  }

  const movies = todayMoviesQuery.data?.data.films;

  const onMovieClick = (movieId: number | string) => {
    const path = ROUTER_PATHS_DYNAMIC.getMovie(movieId);
    navigate(path);
  };

  return (
    <>
      <Stack direction="column" gap={2}>
        <Typography component="h2" variant="h5" fontWeight={700}>
          Афиша
        </Typography>
        {!movies?.length && <Typography>Сегодня нет фильмов</Typography>}
        {!!movies?.length && (
          <Grid container spacing={4}>
            {movies.map((movie) => (
              <Grid key={movie.id} item xs={12} sm={6} md={4}>
                <MovieCard movie={movie} onMovieClick={onMovieClick} />
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>
    </>
  );
}
