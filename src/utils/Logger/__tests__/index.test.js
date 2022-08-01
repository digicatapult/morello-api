const Logger = require('../../Logger')

describe('Logger', () => {
  let logger;
  beforeEach(() => {
    logger = new Logger()
  })

  it('creates an iinstance of logger and returns log object', () => {
    expect(logger).objectContaining({
      nane: 'morello-api'
    })
  })
})