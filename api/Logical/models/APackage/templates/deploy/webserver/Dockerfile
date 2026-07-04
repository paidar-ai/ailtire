FROM node:alpine

WORKDIR /usr/src/app

COPY deploy/webserver/package*.json ./

RUN npm install

COPY . .

EXPOSE 5173
CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0" ]
