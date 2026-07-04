FROM node:alpine

WORKDIR /usr/src/app

COPY deploy/microservice/package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
CMD [ "node", "deploy/microservice/server.js" ]
