# Cinema (Client)

[Backend](https://github.com/debabin/shift-backend)

[Deployed](https://leendrew.github.io/cinema-client-react)

## Stack

- React
- zustand
- React Query
- MUI
- React Hook Form
- zod

## Installation

### dev

```bash
cp .env.example .env.local
pnpm i
pnpm dev
```

### prod

```bash
cp .env.example .env.production
pnpm i --frozen-lockfile
pnpm build && pnpm preview
```
