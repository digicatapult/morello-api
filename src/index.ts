import config from 'config';
import { urlencoded, json } from 'body-parser';
import * as swaggerUI from 'swagger-ui-express';
import express, { Express } from 'express';

import { RegisterRoutes } from './routes';
import * as swaggerJson from './swagger.json';

import logger from './utils/Logger'

const app: Express = express()
const port: Number = config.get('app.port')
let log = logger.child({ example: "child-example" })

app.use(urlencoded({ extended: true }))
app.use(json())
RegisterRoutes(app)
app.use(['/openapi', '/docs', '/swagger'], swaggerUI.serve, swaggerUI.setup(swaggerJson))
// TODO - errors and error handler 

app.listen(port, () => {
  log.info('Server is running')
});
