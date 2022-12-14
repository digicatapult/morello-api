import config from 'config'
import { Express } from 'express'
import { validateExecutables } from './utils/executables'
import logger from './utils/Logger'
import { CreateHttpServer } from './server'

const start = async () => {
  const binaryDir: string = config.get('app.binaryDir')
  await validateExecutables(binaryDir)

  const app: Express = await CreateHttpServer()
  const port: number = config.get('app.port')

  app.listen(port, () => {
    logger.info('Server is running')
  })
}
start()
