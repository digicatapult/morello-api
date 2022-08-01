import pino, { Logger } from "pino"

// TODO make a class with methods like 
// add(opts) - should add childs to the logger
// wrap up info/error etc
// unit tests
// assign logger to req.log?
const logger: Logger = pino({
  name: 'morello-api',
  timestamp: true,
}, process.stdout)

export default logger