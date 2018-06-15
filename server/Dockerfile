FROM node:10

LABEL maintainer="Brian Lusina,lusinabrian@gmail.com"

COPY . /app

# this will expose this app to other containers via port 5000
EXPOSE 5000

ENTRYPOINT [ "npm" ]

CMD [ "run", "start" ]
