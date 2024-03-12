# 指定node镜像
FROM node:20.11.0-alpine

# Installs latest Chromium (100) package.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN addgroup -S pptruser && adduser -S -G pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app \
    && chown -R pptruser:pptruser /usr

# Run everything after as non-privileged user.
USER pptruser

WORKDIR /app

RUN npm install -g cnpm --registry=https://registry.npmmirror.com

COPY package*.json ./

RUN cnpm install

COPY . .

EXPOSE 7575

CMD ["npm", "run", "start:prod"]
