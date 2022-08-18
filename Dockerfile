FROM ghcr.io/seanghay/puppeteer-google-fonts:main

USER pptruser

RUN mkdir -p /home/pptruser/app

WORKDIR /home/pptruser/app

COPY --chown=pptruser:pptruser package.json package-lock.json ./

RUN npm ci --omit dev

COPY --chown=pptruser:pptruser index.js .

RUN chown -R pptruser:pptruser /home/pptruser/app/node_modules/

EXPOSE 8080

CMD [ "node", "index.js" ]