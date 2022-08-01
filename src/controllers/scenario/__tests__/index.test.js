const { scenario } = require('../index')
const child = require('child_process')

jest.mock('child_process')

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

  beforeEach(async () => {
    child.exec = jest.fn((_, cb) => {
      cb(null, { stdout: 'ok' })
    })
    res = await execute()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('if executing binaries fails', () => {
    it('returns the correct state along with stderr', () => {
    })
  })

  it('exectures commands and returns formmated output', () => {
    expect(res).toEqual(expect.objectContaining({
      morello: expect.objectContaining({
        output: {
          stdout: "ok"
        },
      }),
      self: expect.objectContaining({
        output: {
          stdout: "ok"
        }
      })
    }))
  })
})
