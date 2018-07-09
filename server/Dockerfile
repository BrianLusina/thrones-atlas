FROM node:10

LABEL maintainer="Brian Lusina,lusinabrian@gmail.com"

WORKDIR /app

COPY . /app

RUN npm install

# this will expose this app to other containers via port 5000
EXPOSE 5000

CMD [ "npm", "run", "start" ]
