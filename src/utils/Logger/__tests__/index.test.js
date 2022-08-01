const Logger = require('../../Logger').default

describe('Logger', () => {
  let log

  beforeEach(() => {
    log = Logger.child({ test: true })
  })

  it('creates an iinstance of logger and returns log object', () => {
    expect(log.bindings()).toEqual(
      expect.objectContaining({
        name: 'morello-api',
        test: true,
      })
    )
  })
})
