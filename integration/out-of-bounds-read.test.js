const { describe, before, test } = require('mocha')
const { expect } = require('chai')
const { CreateHttpServer } = require('../src/index')
const { getOutOfBoundsReadAarch64, getOutOfBoundsReadCheri } = require('./helper/routeHelper')

describe('Tests aarch64 version', () => {
  let app

  before(async function () {
    app = await CreateHttpServer()
  })

  test('Happy Path', async () => {
    const response = await getOutOfBoundsReadAarch64(app, 'pass', -32, -28)

    expect(response.status).to.equal(200)
    expect(response.body.status).to.contain('success')
  })

  test('Missing Parameters', async () => {
    const response = await getOutOfBoundsReadAarch64(app, 'pass_1', -32)

    expect(response.status).to.equal(200) // Should be 400?
    expect(response.body.status).to.contain('success') //should be 'error'
  })

  test('Bad Parameters', async () => {
    const response = await getOutOfBoundsReadAarch64(app, 'badpass', NaN, 'ttttttt')

    expect(response.status).to.equal(200) // Should be 400?
    expect(response.body.status).to.contain('success') // Should be an error?
  })
})

describe('Tests Cheri version', () => {
  let app

  before(async () => {
    app = await CreateHttpServer()
  })

  test('Happy Path', async () => {
    const response = await getOutOfBoundsReadCheri(app, 'cheripass', -32, -21)

    expect(response.status).to.equal(200)
    expect(response.body.status).to.contain('error')
  })

  test('Missing Parameter', async () => {
    const response = await getOutOfBoundsReadCheri(app, 'cheripass', -32)

    expect(response.status).to.equal(200) //Should be 400?
    expect(response.body.status).to.contain('error')
  })

  test('Bad Parameter', async () => {
    const response = await getOutOfBoundsReadCheri(app, 'cheripass', 'cube', 'tarmac')

    expect(response.status).to.equal(200) //Should be 400?
    expect(response.body.status).to.contain('success') //Should be an error?
  })
})
