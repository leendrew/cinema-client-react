// TODO: refactor for better solution

export const ROUTER_PATHS = {
  main: '/',
  auth: {
    login: '/auth/login',
  },
  profile: '/profile',
  tickets: '/tickets',
  movie: '/movies/:id',
} as const;

export const ROUTER_PATHS_DYNAMIC = {
  getMovie: (id: number) => `/movies/${id}`,
};
