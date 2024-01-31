import { Button as MuiButton, Stack, CircularProgress } from '@mui/material';
import type { ButtonProps } from '@mui/material';

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

export function Button({
  loading = false,
  loadingText,
  children,
  disabled,
  ...rest
}: LoadingButtonProps) {
  return (
    <MuiButton disabled={disabled || loading} {...rest}>
      <Stack direction="row" alignItems="center" gap={1}>
        {loading && (
          <>
            <CircularProgress color="inherit" size="1rem" />
            {loadingText}
          </>
        )}
        {!loading && children}
      </Stack>
    </MuiButton>
  );
}
