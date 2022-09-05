import config from 'config'
import { urlencoded, json } from 'body-parser'
import * as swaggerUI from 'swagger-ui-express'
import express, { Express } from 'express'
import cors from 'cors'

import { RegisterRoutes } from './routes'
import * as swaggerJson from './swagger.json'

import { errorHandler } from './utils/errors'
import { validateExecutables } from './utils/executables'
import logger from './utils/Logger'

export async function CreateHttpServer(): Promise<Express> {
  const app: Express = express()

  app.use(urlencoded({ extended: true }))
  app.use(json())
  app.use(cors())
  RegisterRoutes(app)
  app.use(['/openapi', '/docs', '/swagger'], swaggerUI.serve, swaggerUI.setup(swaggerJson))
  app.use(errorHandler)

  return app
}

const start = async () => {
  await validateExecutables()

  const app: Express = await CreateHttpServer()
  const port: number = config.get('app.port')

  app.listen(port, () => {
    logger.info('Server is running')
  })
}
start()
