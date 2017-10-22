FROM node:latest

MAINTAINER Brian Lusina "lusinabrian@gmail.com"

COPY ./package.json /app/package.json

WORKDIR /app

RUN npm install

COPY . /app

# this will expose this app to other containers via port 8000
EXPOSE 5000

ENTRYPOINT [ "npm" ]

CMD [ "run", "start" ]
