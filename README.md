# morello-api

## Description

A `Node.js` API for executing binaries on Morello and `aarch64` architecture. Requires an instance of Morello e.g. [Morello SDK](https://github.com/CTSRD-CHERI/cheribuild). The API copies binaries to the Morello instance, executes them and returns the output.

## Configuration

Use a `.env` at root of the repository to set values for the environment variables defined in [custom-environment-variables.json](./config/custom-environment-variables.json).

| variable         | required |   default   | description                                                                          |
| :--------------- | :------: | :---------: | :----------------------------------------------------------------------------------- |
| PORT             |    N     |   `3000`    | The port for the API to listen on                                                    |
| LOG_LEVEL        |    N     |   `debug`   | Logging level. Valid values are [`trace`, `debug`, `info`, `warn`, `error`, `fatal`] |
| MORELLO_HOST     |    N     | `127.0.0.1` | Morello host name                                                                    |
| MORELLO_PORT     |    N     |   `1022`    | Morello port                                                                         |
| MORELLO_USERNAME |    N     |   `root`    | Morello username                                                                     |
| BINARY_DIR       |    N     |    `bin`    | Directory in which to find scenario binaries                                         |

[default.json](./config/default.json) contains default configuration values.

Alternatively create a `./config/local.json` file to override the values of `default.json`.

## Binaries

Binaries to be executed by the API should by default be located in the [bin](./bin/) directory. If using the Docker image built from this repository the latest binaries are included at image build time from the latest release of [https://github.com/digicatapult/morello-examples](https://github.com/digicatapult/morello-examples). When developing locally you can either download the latest binaries from that repository or there are a couple of helper npm scripts to help you manage them. To update to the latest release you can run:

```sh
npm run examples:update
```

And to perform a purge of currently installed binaries do:

```sh
npm run examples:clean
```

## Getting started

```sh
# start dependencies
docker compose up -d
# install packages
npm i
# download latest binaries
npm run examples:update
# generate swagger and route files for Open API
npm run build
# start service in dev mode. In order to start in full - npm start"
npm run dev
```

View OpenAPI documentation for all routes with Swagger:

```
localhost:3000/swagger/
```

## Tests

**Unit** and **integration** test are executed by calling the following commands:

```sh
npm run test:integration
npm run test:unit
```
