const Logger = require('../../Logger').default

describe('Logger', () => {
  let log

  beforeEach(() => {
    log = Logger.child({ test: true })
  })

  it('creates an instance of logger and returns log object', () => {
    expect(log.bindings()).toEqual(
      expect.objectContaining({
        name: 'morello-api',
        test: true,
      })
    )
  })
})
