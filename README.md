# Cinema Shift 2024 (Client)

[Backend](https://github.com/debabin/shift-backend)

[Deployed](https://leendrew.github.io/cinema-shift-2024)

## Stack

- React
- Redux Toolkit
- RTK Query
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
