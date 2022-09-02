const paramUtil = require('../../../utils/params')
const execUtil = require('../../../utils/executables')
const { ScenarioNotFoundError } = require('../../../utils/errors')
const { scenario } = require('../index')
const { stub } = require('sinon')
const { expect } = require('chai')
const child = require('child_process')
const config = require('config')

const address = `${config.get('morello.username')}@${config.get('morello.host')}`
const port = config.get('morello.port')

const execute = async () => {
  try {
    const controller = new scenario()
    return await controller.get('out-of-bounds-read-cheri', ['test'])
  } catch (err) {
    return err
  }
}

const setupMocks = (stubs, options = {}) => {
  before(async () => {
    stubs.getRandomProcessName = stub(paramUtil, 'getRandomProcessName')
    stubs.getRandomProcessName.returns('out-of-bounds-read-cheri_foo')
    stubs.checkExecutable = stub(execUtil, 'checkExecutable')
    stubs.checkExecutable.resolves(options.checkExecutable === undefined ? true : options.checkExecutable)
    stubs.exec = stub(child, 'exec')
    stubs.exec.onCall(0).yields(options.exec.err, options.exec.stdout)
    stubs.exec.onCall(1)
  })

  after(() => {
    stubs.getRandomProcessName.restore()
    stubs.checkExecutable.restore()
    stubs.exec.restore()
  })
}

describe('/scenario/{example} endpoint', () => {
  describe('happy path', () => {
    let res
    let stubs = {}

    setupMocks(stubs, {
      exec: {
        err: null,
        stdout: 'stdout - success',
      },
    })

    before(async () => {
      res = await execute()
    })

    it('calls exec correctly', () => {
      const firstCallArg = stubs.exec.firstCall.args[0]
      const expectation = `scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -q -P ${port} bin/out-of-bounds-read-cheri ${address}:/tmp/out-of-bounds-read-cheri_foo; ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -q -p ${port} ${address} -t << 'EOF'
chmod +x /tmp/out-of-bounds-read-cheri;
/tmp/out-of-bounds-read-cheri_foo 'test' 2>&1;
exit;
EOF`

      expect(firstCallArg).to.equal(expectation)
    })

    it('returns a formatted output', () => {
      expect(res).to.include.all.keys(['output', 'status'])
      expect(res).to.deep.equal({
        status: 'success',
        output: 'stdout - success',
      })
    })
  })

  describe('if executing binaries fails', () => {
    let res
    let stubs = {}
    setupMocks(stubs, {
      exec: {
        err: { message: 'error' },
        stdout: 'stdout - some error output',
      },
    })
    before(async () => {
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

  describe("if binary doesn't exist", () => {
    let res
    let stubs = {}
    setupMocks(stubs, {
      exec: {
        err: null,
        stdout: 'stdout - success',
      },
      checkExecutable: false,
    })
    before(async () => {
      res = await execute()
    })

    it('returns', () => {
      expect(res).to.be.an.instanceOf(ScenarioNotFoundError)
    })
  })
})
