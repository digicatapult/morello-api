# syntax=docker/dockerfile:1.4
FROM node:16-alpine as builder

WORKDIR /morello-api

# Install base dependencies
RUN npm -g install npm@8.x.x

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci
COPY . .
RUN npm run build

#Pull Assets
FROM node:16-alpine as assets

RUN apk --no-cache add curl
WORKDIR /tmp/
ARG TARGETPLATFORM
RUN <<EOF
  #!/usr/bin/env sh
  set -ex
  if [ "$TARGETPLATFORM" = "linux/amd64" ]; then
    export ARCHITECTURE=amd64;
  elif [ "$TARGETPLATFORM" = "linux/arm64" ]; then
    export ARCHITECTURE=arm64;
  else
    export ARCHITECTURE=amd64;
  fi
  curl -L https://github.com/gruntwork-io/fetch/releases/download/v0.4.5/fetch_linux_${ARCHITECTURE} --output ./fetch
  chmod +x ./fetch
EOF

ARG MORELLO_EXAMPLES_VERSION=latest
ARG MORELLO_EXAMPLES_REPO=https://github.com/digicatapult/morello-examples

RUN <<EOF
  #!/usr/bin/env sh
  set -ex
  ./fetch --repo="${MORELLO_EXAMPLES_REPO}" --tag="${MORELLO_EXAMPLES_VERSION}" --release-asset="morello-examples.tar.gz" ./
  mkdir /morello-examples
  tar -xzf ./morello-examples.tar.gz -C /morello-examples
EOF

# Service
FROM node:16-alpine as service

RUN apk --no-cache add openssh
WORKDIR /morello-api

RUN npm -g install npm@8.x.x

COPY package*.json ./
RUN npm ci --production
COPY --from=builder /morello-api/build .
COPY --from=builder /morello-api/config ./config
COPY --from=assets /morello-examples /morello-api/bin

EXPOSE 80
CMD [ "node", "./index.js" ]
