FROM node:10

LABEL maintainer="Brian Lusina lusiabrian@gmail.com"

WORKDIR /app

COPY . /app

RUN npm install

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]
