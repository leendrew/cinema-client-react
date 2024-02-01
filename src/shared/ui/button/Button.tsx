import { Button as MuiButton, Stack, CircularProgress } from '@mui/material';
import type { ButtonProps as MuiButtonProps } from '@mui/material';

interface ButtonProps extends MuiButtonProps {
  loading?: boolean;
  loadingText?: string;
}

export function Button({ loading = false, loadingText, children, disabled, ...rest }: ButtonProps) {
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
