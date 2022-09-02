const { describe, before, test } = require('mocha')
const { expect } = require('chai')
const { CreateHttpServer } = require('../src/index')
const { getOutOfBoundsReadAarch64 } = require('./helper/routeHelper')

describe('Tests aarch64 version', () => {
  let app

  before(async function () {
    app = await CreateHttpServer()
  })

  test('Happy Path', async function () {
    const response = await getOutOfBoundsReadAarch64(app, 'pass', -32, -28)

    expect(response.status).to.equal(200)
    expect(response.body.output).to.contain('pass')
  })
})
