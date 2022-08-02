# syntax=docker/dockerfile:1.0.0-experimental
FROM node:16-alpine as builder

WORKDIR /morello-api

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

# Install base dependencies
RUN npm -g install npm@8.x.x

COPY package*.json ./
RUN npm install --production
COPY --from=builder /morello-api/build .
COPY --from=builder /morello-api/config ./config

EXPOSE 80
CMD [ "node", "./index.js" ]
