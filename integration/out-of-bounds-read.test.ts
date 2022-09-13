import { describe, before, test } from 'mocha'
import { expect } from 'chai'
import express from 'express'
import { CreateHttpServer } from '../src/server'
import {
  getOutOfBoundsReadCheri,
  getOutOfBoundsReadAarch64,
  getInvalidExecutable,
} from '../integration/helper/routeHelper'

describe('Tests aarch64 version', () => {
  let app: express.Express

  before(async function () {
    app = await CreateHttpServer()
  })

  test('Happy Path - aarch64', async () => {
    const response = await getOutOfBoundsReadAarch64(app, 'pass', -32, -28)

    expect(response.status).to.equal(200)
    expect(response.body.output).to.contain('Storing Secret...\nThe data between indices -32 and -28 is: pass\n')
    expect(response.body.status).to.contain('success')
  })

  test('Handles Exception - aarch64', async () => {
    const response = await getOutOfBoundsReadAarch64(app, 'pass', 'abc', -28)

    expect(response.status).to.equal(200)
    expect(response.body.output).to.contain('Storing Secret...\nEnd index must be after start index')
    expect(response.body.exception).to.deep.contain({
      killed: false,
      code: 1,
      signal: null,
    })
  })

  test('Bad Parameters - aarch64', async () => {
    const response = await getOutOfBoundsReadAarch64(app, 'badpass', NaN, 'ttttttt')

    expect(response.status).to.equal(200)
    expect(response.body.status).to.contain('success')
  })

  test('Missing Parameters - aarch64', async () => {
    const response = await getOutOfBoundsReadAarch64(app, 'badpass', '', '')

    expect(response.status).to.equal(200)
    expect(response.body.status).to.contain('success')
  })
})

describe('Tests Cheri version', () => {
  let app: express.Express

  before(async () => {
    app = await CreateHttpServer()
  })

  test('Happy Path - cheri', async () => {
    const response = await getOutOfBoundsReadCheri(app, 'cheripass', -32, -21)

    expect(response.status).to.equal(200)
    expect(response.body.status).to.contain('error')
    expect(response.body).to.have.property('exception').that.deep.contain({
      killed: false,
      code: 162,
    })
    expect(response.body.output).to.contain('In-address space security exception (core dumped)')
  })

  test('Handles Exception - cheri', async () => {
    const response = await getOutOfBoundsReadCheri(app, 'pass', 'abc', -28)

    expect(response.status).to.equal(200)
    expect(response.body.output).to.contain('Storing Secret...\nEnd index must be after start index')
    expect(response.body.exception).to.deep.contain({
      killed: false,
      code: 1,
      signal: null,
    })
  })

  test('Bad Parameters - cheri', async () => {
    const response = await getOutOfBoundsReadCheri(app, 'cheripass', 'cube', 'tarmac')

    expect(response.status).to.equal(200)
    expect(response.body.status).to.contain('success')
  })

  test('Missing Parameters - cheri', async () => {
    const response = await getOutOfBoundsReadCheri(app, 'cheripass', '', '')

    expect(response.status).to.equal(200)
    expect(response.body.status).to.contain('success')
  })
})

describe('Tests Invalid Executable version', () => {
  let app: express.Express

  before(async () => {
    app = await CreateHttpServer()
  })

  test('Sad Path - non-existant test', async () => {
    const response = await getInvalidExecutable(app, 'invalidpass')

    expect(response.status).to.equal(422)
  })
})
