FROM node:latest

MAINTAINER Brian Lusina "lusinabrian@gmail.com"

COPY ./package.json /app/package.json

ENV PORT 5000
ENV DATABASE_URL postgres://nightking:atlas@database:5432/atlasofthrones?ssl=false
ENV REDIS_HOST localhost
ENV REDIS_PORT 6379
ENV CORS_ORIGIN http://localhost:8080

WORKDIR /app

RUN npm install

COPY . /app

# this will expose this app to other containers via port 8000
EXPOSE 5000

# ENTRYPOINT [ "npm" ]

CMD [ "npm", "run", "start" ]
