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
    stubs.exec.onCall(0).yields(null, 'stdout - success')
    stubs.exec.onCall(1)
    res = await execute()
  })

  afterEach(() => {
    stubs.exec.restore()
  })

  describe('if executing binaries fails', () => {
    beforeEach(async () => {
      stubs.exec.restore()
      stubs.exec = stub(child, 'exec')
      stubs.exec.onCall(0).yields({ message: 'error' }, 'stdout - some error output')
      stubs.exec.onCall(1)
      res = await execute()
    })

    it('returns correct state along with exceptions if both binaries fail', () => {
      expect(res).to.deep.equal({
        status: 'error',
        output: 'stdout - some error output',
        exception: { message: 'error' },
      })
    })
  })

  it('returns a formatted output', () => {
    expect(res).to.include.all.keys(['output', 'status'])
    expect(res).to.deep.equal({
      status: 'success',
      output: 'stdout - success',
    })
  })
})
