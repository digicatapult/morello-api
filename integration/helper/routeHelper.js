const request = require('supertest')

async function getOutOfBoundsReadAarch64(app, password, firstOffset, secondOffset) {
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

async function getOutOfBoundsReadCheri(app, password, firstOffset, secondOffset) {
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

async function getInvalidExecutable(app, password, firstOffset, secondOffset) {
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
