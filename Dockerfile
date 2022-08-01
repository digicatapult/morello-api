# syntax=docker/dockerfile:1.0.0-experimental
FROM node:16-alpine as builder

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

RUN npm install
COPY . .
RUN npm run build

# Service
FROM node:16-alpine as service

WORKDIR /morello-api
COPY package*.json ./
RUN npm install --production
COPY --from=builder /morello-api/build .

EXPOSE 80
CMD [ "node", "./build/index.js" ]
