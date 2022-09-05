import { expect } from 'chai'
import Logger from '../../Logger'

describe('Logger', () => {
  let log: typeof Logger

  beforeEach(() => {
    log = Logger.child({ test: true })
  })

  it('creates an instance of logger and returns log object', () => {
    expect(log.bindings()).to.deep.equal({
      name: 'morello-api',
      test: true,
    })
  })
})
