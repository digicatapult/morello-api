const util = require('../../../utils/params')
const { scenario } = require('../index')
const { stub } = require('sinon')
const { expect } = require('chai')
const child = require('child_process')

const execute = async () => {
  try {
    const controller = new scenario()
    return await controller.get('out-of-bounds-read-cheri', ['test'])
  } catch (err) {
    return err
  }
}

describe('/scenario/{example} endpoint', () => {
  let res
  let stubs = {}

  beforeEach(async () => {
    stubs.getRandomProcessName = stub(util, 'getRandomProcessName')
    stubs.getRandomProcessName.returns('out-of-bounds-read-cheri_foo')
    stubs.exec = stub(child, 'exec')
    stubs.exec.onCall(0).yields(null, 'stdout - success')
    stubs.exec.onCall(1)
    res = await execute()
  })

  afterEach(() => {
    stubs.getRandomProcessName.restore()
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

    it ('calls exec correctly', () => {
      const firstCallArg = stubs.exec.firstCall.args[0]
      const expectation =
`scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -q -P 1022 bin/out-of-bounds-read-cheri root@127.0.0.1:/tmp/out-of-bounds-read-cheri_foo; ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -q -p 1022 root@127.0.0.1 -t << 'EOF'
chmod +x /tmp/out-of-bounds-read-cheri;
/tmp/out-of-bounds-read-cheri_foo 'test' 2>&1;
exit;
EOF`
      expect(firstCallArg).to.equal(expectation)
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
