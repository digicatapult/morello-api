
# syntax=docker/dockerfile:1.0.0-experimental
FROM node:16-alpine

WORKDIR /morello-api

# Allow log level to be controlled. Uses an argument name that is different
# from the existing environment variable, otherwise the environment variable
# shadows the argument.
ARG LOGLEVEL
ENV NPM_CONFIG_LOGLEVEL ${LOGLEVEL}

# Install base dependencies
RUN npm -g install npm@8.x.x

COPY package*.json ./
COPY tsconfig.json ./
COPY src /morello-api/src
COPY types /morello-api/types

RUN npm install
RUN npm run build

FROM node:16-alpine

WORKDIR /morello-api
RUN npm install --production
COPY --from=0 /morello-api/build .

EXPOSE 80
CMD [ "node", "./build/index.js" ]
