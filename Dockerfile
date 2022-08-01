# syntax=docker/dockerfile:1.0.0-experimental
FROM node:16-alpine


# Allow log level to be controlled. Uses an argument name that is different
# from the existing environment variable, otherwise the environment variable
# shadows the argument.
ARG LOGLEVEL
ENV NPM_CONFIG_LOGLEVEL ${LOGLEVEL}

RUN apk update

WORKDIR /morello-api

COPY package*.json ./
COPY tsconfig.json ./
COPY src /morello-api/src
COPY types /morello-api/types

RUN npm install --production
RUN npm run build

EXPOSE 80

CMD [ "node", "./build/index.js" ]
