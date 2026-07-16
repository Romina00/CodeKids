FROM node:24-bookworm-slim AS dependencies

WORKDIR /app
ENV HUSKY=0

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json
COPY packages/ui/package.json packages/ui/package.json

RUN --mount=type=cache,target=/root/.npm \
    npm ci --ignore-scripts --no-audit --no-fund

FROM dependencies AS build

ARG NEXT_PUBLIC_CODEKIDS_API_URL=http://localhost:3001
ENV NEXT_PUBLIC_CODEKIDS_API_URL=$NEXT_PUBLIC_CODEKIDS_API_URL

COPY . .
RUN npm run build

FROM build AS web

ENV NODE_ENV=production
ENV PORT=3003
EXPOSE 3003
CMD ["npm", "run", "start", "--workspace", "web"]

FROM build AS api

ENV NODE_ENV=production
EXPOSE 3001
CMD ["npm", "run", "start:prod", "--workspace", "@codekids/backend"]
