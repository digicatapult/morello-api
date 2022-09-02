import pino, { Logger } from 'pino'
import config from 'config'

// TODO make a class with methods like
// add(opts) - should add childs to the logger
// wrap up info/error etc
// unit tests
// assign logger to req.log?
const logger: Logger = pino(
  {
    name: 'morello-api',
    timestamp: true,
    level: config.get('log.level'),
  },
  process.stdout
)

export default logger
