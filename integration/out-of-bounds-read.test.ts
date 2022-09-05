import { describe, before, test } from 'mocha'
import { expect } from 'chai'
import express from 'express'
import { CreateHttpServer } from '../src/index'
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

    console.log(response)
    expect(response.status).to.equal(200)
    expect(response.body.status).to.contain('success')
  })

  test('Bad Parameters - aarch64', async () => {
    const response = await getOutOfBoundsReadAarch64(app, 'badpass', NaN, 'ttttttt')

    console.log(response.body)
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

    console.log(response.body)
    expect(response.status).to.equal(200)
    expect(response.body.status).to.contain('error')
  })

  test('Bad Parameters - cheri', async () => {
    const response = await getOutOfBoundsReadCheri(app, 'cheripass', 'cube', 'tarmac')

    console.log(response.body)
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

    console.log(response.body)
    expect(response.status).to.equal(422)
  })
})
