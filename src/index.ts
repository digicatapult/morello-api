import config from 'config'
import { urlencoded, json } from 'body-parser'
import * as swaggerUI from 'swagger-ui-express'
import express, { Express } from 'express'
import cors from 'cors'

import { RegisterRoutes } from './routes'
import * as swaggerJson from './swagger.json'

import { errorHandler } from './utils/errors'
import  { validateExecutables } from './utils/executables'
import logger from './utils/Logger'

const start = async () => {
  await validateExecutables()

  const app: Express = express()
  const port: Number = config.get('app.port')

  app.use(urlencoded({ extended: true }))
  app.use(json())
  app.use(cors())
  RegisterRoutes(app)
  app.use(['/openapi', '/docs', '/swagger'], swaggerUI.serve, swaggerUI.setup(swaggerJson))
  app.use(errorHandler)

  app.listen(port, () => {
    logger.info('Server is running')
  })
}
start()


