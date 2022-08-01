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

  beforeEach(() => {
    jest.resetAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
  // This is a placeholdesr and will be updated shortly
  describe.only('if uploading binary file on the morello host fails', () => {
    it('does not attempt to execute any binaries', async () => {
      child.exec = jest.fn((_, cb) => {
        cb('testing')
      })
      res = await execute()

      expect(child.exec).toHaveBeenCalledTimes(1)
    })

    it('returns report containing error message', async () => {
      child.exec = jest.fn((_, cb) => cb(null, { stdout: 'ok' }))
      res = await execute()
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

  describe('if executing binaries fails', () => {
    it('returns the correct state along with stderr', () => {
      expect(1).toBe(1) // tmp
    })
  })

  it('exectures commands and returns formmated output', () => {
    expect(1).toBe(1) // tmp
  })
})
