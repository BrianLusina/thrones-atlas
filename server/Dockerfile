FROM node:10

LABEL maintainer="Brian Lusina,lusinabrian@gmail.com"

ENV PORT 5000
ENV DATABASE_URL postgres://nightking:atlas@database:5432/atlasofthrones?ssl=false
ENV REDIS_HOST localhost
ENV REDIS_PORT 6379
ENV CORS_ORIGIN http://localhost:8080

WORKDIR /app

COPY . /app

RUN npm install

ENV DATABASE_URL ${DATABASE_URL}
ENV REDIS_HOST ${REDIS_HOST}
ENV REDIS_PORT ${REDIS_PORT}

# this will expose this app to other containers via port 5000
EXPOSE 5000

CMD [ "npm", "run", "start" ]
