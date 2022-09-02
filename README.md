# morello-api

## Description

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

[default.json](./config/default.json) contains default configuration values.

Alternatively create a `./config/local.json` file to overwrite the values of `default.json`.

## Binaries

Binaries to be executed by the API are located in the [bin](./bin/) directory, however the API is primarily designed to be used as a docker image. [Dockerfile](./Dockerfile) replaces the contents of `bin` with the latest binaries from [`morello-examples`](https://github.com/digicatapult/morello-examples), a separately maintained list of examples designed to illustrate how certain common software defects can be protected against by running on a Cheri-enabled platform.

Some simple binaries are included in this repository for local testing. Binaries can also be added manually to the `bin` directory. Each binary will need its filename added to the [`Executables`](./types/models/scenario.ts) type to appear as an option on the API route.

## Getting started

```sh
 # start dependencies
docker compose up -d
 # install packages
npm i
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
