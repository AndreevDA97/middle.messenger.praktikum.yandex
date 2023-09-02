FROM node:18.16.0

WORKDIR /docker

COPY . .

RUN npm install

RUN npm run build

CMD ["node", "server.js"]

EXPOSE 3000
