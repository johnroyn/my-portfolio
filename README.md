# John Roy Nengasca Portfolio

A gallery-style personal portfolio built with React, TypeScript, Vite, and Three.js.

## Requirements

- Node.js 20 or newer
- pnpm 10 or newer

## Local development

```bash
pnpm install
pnpm dev
```

Open the local URL printed by Vite.

## Validation and production build

```bash
pnpm run check
pnpm run build
pnpm run preview
```

The production build creates the browser files in `dist/public` and bundles the optional Express server as `dist/index.js`. To run the bundled server after building, use `pnpm start` with `NODE_ENV=production`.

## Deployment

This project can be deployed to a Node-compatible host. Set the host's build command to `pnpm install --frozen-lockfile && pnpm run build`, start command to `pnpm start`, and provide `PORT` when the platform requires it.

The active homepage does not require API keys or environment variables. Keep local `.env` files and platform configuration out of Git; they are ignored by `.gitignore`.

## Project structure

- `client/` React application and static assets
- `server/` production Express server
- `shared/` shared TypeScript code
