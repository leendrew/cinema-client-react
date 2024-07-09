import { Box, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import { Button } from '@/shared/ui';
import type { Movie } from '@/store';
import { envConfig } from '@/config';

interface MovieCardProps {
  movie: Movie;
  onMoreDetailsClick: (movieId: string | number) => void;
}

export function MovieCard({ movie, onMoreDetailsClick }: MovieCardProps) {
  return (
    <>
      <Card component="article">
        <CardMedia
          sx={{
            height: '300px',
          }}
          component="img"
          src={envConfig.apiUrl + movie.img}
          alt={movie.name}
        />
        <CardContent>
          <Typography
            component="h3"
            variant="h6"
            fontWeight={600}
          >
            {movie.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {movie.genres.join(', ')}
          </Typography>
          <Box
            sx={{
              marginTop: '0.5rem',
            }}
          >
            {Object.entries(movie.userRatings).map(([site, rating]) => (
              <Typography
                key={site}
                variant="body2"
                color="text.secondary"
              >
                {site} - {rating}
              </Typography>
            ))}
          </Box>
        </CardContent>
        <CardActions>
          <Button
            sx={{
              width: '100%',
            }}
            variant="contained"
            onClick={() => onMoreDetailsClick(movie.id)}
          >
            Подробнее
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
