const { scenario } = require('../index')
const { stub } = require('sinon')
const { expect } = require('chai')
const child = require('child_process')

const execute = async () => {
  try {
    const controller = new scenario()
    return await controller.get()
  } catch (err) {
    return err
  }
}

describe('/scenario/{example} endpoint', () => {
  let res
  let stubs = {}

  beforeEach(async () => {
    stubs.exec = stub(child, 'exec')
    stubs.exec.onCall(0).yields(null, 'stdout - some output')
    stubs.exec.onCall(1)
    stubs.exec.onCall(2).yields(null, 'stdout - some output')
    stubs.exec.onCall(3)
    res = await execute()
  })

  afterEach(() => {
    stubs.exec.restore()
  })

  describe('if executing binaries fails', () => {
    beforeEach(async () => {
      stubs.exec.restore()
      stubs.exec = stub(child, 'exec')
      stubs.exec.onCall(0).yields({ message: 'cheri - error' }, 'stdout - some output')
      stubs.exec.onCall(1)
      stubs.exec.onCall(2).yields({ message: 'aarch64 - error' }, 'stdout - some output')
      stubs.exec.onCall(3)
      res = await execute()
    })

    it('returns correct state along with exceptions if both binaries fail', () => {
      expect(res).to.include.all.keys(['aarch64', 'cheri'])
      expect(res.aarch64).to.deep.equal({
        status: 'error',
        output: 'stdout - some output',
        exception: { message: 'aarch64 - error' },
      })
      expect(res.cheri).to.deep.equal({
        status: 'error',
        output: 'stdout - some output',
        exception: { message: 'cheri - error' },
      })
    })
  })

  describe('and if some binaries fail and some succeed', () => {
    beforeEach(async () => {
      stubs.exec.restore()
      stubs.exec = stub(child, 'exec')
      stubs.exec.onCall(0).yields({ msg: 'fatal error' }, 'stdout - some output')
      stubs.exec.onCall(1)
      stubs.exec.onCall(2).yields(null, 'it was a success')
      stubs.exec.onCall(3)
      res = await execute()
    })

    it('returns formatted output with one with clear indication of failed ones', () => {
      expect(res).to.include.all.keys(['aarch64', 'cheri'])
      expect(res).to.deep.equal({
        aarch64: {
          status: 'success',
          output: 'it was a success',
        },
        cheri: {
          status: 'error',
          output: 'stdout - some output',
          exception: { msg: 'fatal error' },
        },
      })
    })
  })

  it('returns a formatted output of both architectuures', () => {
    expect(res).to.include.all.keys(['aarch64', 'cheri'])
    expect(res).to.deep.equal({
      aarch64: {
        status: 'success',
        output: 'stdout - some output',
      },
      cheri: {
        status: 'success',
        output: 'stdout - some output',
      },
    })
  })
})
