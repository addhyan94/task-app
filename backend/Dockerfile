FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY server.js .

EXPOSE 5500

CMD ["node", "server.js"]