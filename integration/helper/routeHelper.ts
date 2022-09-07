import request from 'supertest'
import express from 'express'

export async function getOutOfBoundsReadAarch64(
  app: express.Express,
  password: any,
  firstOffset: any,
  secondOffset: any
) {
  return request(app)
    .get(`/scenario/out-of-bounds-readV2-aarch64?params=${password}&params=${firstOffset}&params=${secondOffset}`)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send()
    .then((response) => {
      return response
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(`Out of bounds read (aaarch64) ${err}`)
      return err
    })
}

export async function getOutOfBoundsReadCheri(
  app: express.Express,
  password: any,
  firstOffset: any,
  secondOffset: any
) {
  return request(app)
    .get(`/scenario/out-of-bounds-readV2-cheri?params=${password}&params=${firstOffset}&params=${secondOffset}`)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send()
    .then((response) => {
      return response
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(`Out of bounds read (aaarch64) ${err}`)
      return err
    })
}

export async function getInvalidExecutable(app: express.Express, password: any) {
  return request(app)
    .get(`/scenario/out-of-bounds-readV5-aarch64?params=${password}`)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send()
    .then((response) => {
      return response
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(`Out of bounds read (aaarch64) ${err}`)
      return err
    })
}

module.exports = {
  getOutOfBoundsReadAarch64,
  getOutOfBoundsReadCheri,
  getInvalidExecutable,
}
