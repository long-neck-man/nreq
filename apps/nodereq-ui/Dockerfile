# BUILD

FROM node:lts-alpine AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm fetch
COPY . .
RUN pnpm install --frozen-lockfile --offline
RUN pnpm run build

# PACKAGE

FROM nginx:stable-alpine AS runner
COPY --from=build /app/dist /usr/share/nginx/html
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
