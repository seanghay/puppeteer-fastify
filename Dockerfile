FROM ghcr.io/puppeteer/puppeteer:latest

USER root

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y fonts-khmeros \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

USER pptruser

RUN mkdir -p /home/pptruser/app

WORKDIR /home/pptruser/app

COPY --chown=pptruser:pptruser package.json package-lock.json ./

RUN npm ci --omit dev

COPY --chown=pptruser:pptruser index.js .

RUN chown -R pptruser:pptruser /home/pptruser/app/node_modules/

EXPOSE 8080

CMD [ "node", "index.js" ]