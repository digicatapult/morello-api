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

  describe('if executing binaries fails', () => {
    it('returns the correct state along with stderr', () => {
      expect(1).toBe(1) // tmp
    })
  })

  it('exectures commands and returns formmated output', () => {
    expect(1).toBe(1) // tmp
  })
})
