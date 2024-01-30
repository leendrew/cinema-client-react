export const PATHS = {
  auth: {
    login: '/auth/login',
  },
  profile: '/profile',
  tickets: '/tickets',
  movie: (id: number) => `/movies/${id}`,
} as const;
