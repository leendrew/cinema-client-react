import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { muiConfig, MAX_SNACKBAR_STACK, queryConfig } from './config';
import { router } from '@/router';
import './index.css';

function bootstrap() {
  createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ThemeProvider theme={muiConfig}>
        <SnackbarProvider maxSnack={MAX_SNACKBAR_STACK}>
          <QueryClientProvider client={queryConfig}>
            <CssBaseline />
            <RouterProvider router={router} />
          </QueryClientProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </React.StrictMode>,
  );
}
bootstrap();
