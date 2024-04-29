# 指定node镜像
FROM node:20.11.0-alpine AS base

# Installs latest Chromium (100) package.
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

RUN npm i -g pnpm

ENV PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH" \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN addgroup -S pptruser && adduser -S -G pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app \
    && chown -R pptruser:pptruser /usr

WORKDIR /app
COPY . .

# npm install
FROM base AS prod-deps
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# npm run build
FROM base
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

RUN chown -R pptruser:pptruser /app
USER pptruser
EXPOSE 3000
CMD ["npm", "run", "prod"]
