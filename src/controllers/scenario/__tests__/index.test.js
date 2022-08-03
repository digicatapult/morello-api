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

describe('/scenario controller', () => {
  let res
  let stubs = {}

  beforeEach(async () => {
    stubs.exec = stub(child, 'exec').yields(null, { stdout: 'ok' })
    res = await execute()
  })

  afterEach(() => {
    stubs.exec.restore()
  })

  describe('if executing binaries fails', () => {
    beforeEach(async () => {
      stubs.exec.restore()
      stubs.exec = stub(child, 'exec').yields('fatal error')
      res = await execute()
    })

    it('returns the correct state along with stderr', () => {
      expect(res).to.include.all.keys(['aarch64', 'cheri'])
      expect(res.aarch64).to.deep.equal({
        output: 'fatal error',
        status: 'error',
      })
      expect(res.cheri).to.deep.equal({
        output: 'fatal error',
        status: 'error',
      })
    })
  })

  it('exectures commands and returns formmated output', () => {
    expect(res).to.include.all.keys(['aarch64', 'cheri'])
    expect(res).to.deep.equal({
      aarch64: {
        status: 'success',
        output: {
          stdout: 'ok',
        },
      },
      cheri: {
        status: 'success',
        output: {
          stdout: 'ok',
        },
      },
    })
  })
})
