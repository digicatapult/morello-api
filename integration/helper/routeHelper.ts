import request from 'supertest'

export async function getOutOfBoundsReadAarch64(app: any, password: any, firstOffset: any, secondOffset: any) {
  return request(app)
    .get(`/scenario/out-of-bounds-readV2-aarch64?params=${password}&params=${firstOffset}&params=${secondOffset}`)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send()
    .then((response: any) => {
      return response
    })
    .catch((err: any) => {
      // eslint-disable-next-line no-console
      console.error(`Out of bounds read (aaarch64) ${err}`)
      return err
    })
}

export async function getOutOfBoundsReadCheri(app: any, password: any, firstOffset: any, secondOffset: any) {
  return request(app)
    .get(`/scenario/out-of-bounds-readV2-cheri?params=${password}&params=${firstOffset}&params=${secondOffset}`)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send()
    .then((response: any) => {
      return response
    })
    .catch((err: any) => {
      // eslint-disable-next-line no-console
      console.error(`Out of bounds read (aaarch64) ${err}`)
      return err
    })
}

export async function getInvalidExecutable(app: any, password: any) {
  return request(app)
    .get(`/scenario/out-of-bounds-readV5-aarch64?params=${password}`)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send()
    .then((response: any) => {
      return response
    })
    .catch((err: any) => {
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
