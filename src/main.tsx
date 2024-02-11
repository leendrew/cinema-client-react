import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { muiConfig, TOAST_LIMIT, queryConfig } from './config';
import { router } from '@/router';
import 'react-toastify/dist/ReactToastify.min.css';
import './index.css';

function bootstrap() {
  createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryConfig}>
        <ThemeProvider theme={muiConfig}>
          <CssBaseline />
          <RouterProvider router={router} />
          <ToastContainer limit={TOAST_LIMIT} />
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>,
  );
}
bootstrap();
