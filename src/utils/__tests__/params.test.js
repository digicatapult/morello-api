const { expect } = require('chai')
const { escapeParam, getValidHeredocEOF, getRandomProcessName } = require('../params')

describe('getRandomProcessName', () => {
  it('should append a length 10 string of lowercase alpha chars', () => {
    expect(getRandomProcessName('test')).to.match(/^test_[a-z]{10}$/)
  })

  it('should always return a different string', () => {
    const exampleSet = new Set(
      Array(1000)
        .fill(null)
        .map(() => getRandomProcessName('test'))
    )
    expect(exampleSet.size).to.equal(1000)
  })
})

describe('getValidHeredocEOF', () => {
  it('should by default returns EOF', () => {
    expect(getValidHeredocEOF('test', [])).to.equal('EOF')
  })

  it('should append _ if bin contains EOF', () => {
    expect(getValidHeredocEOF('test_EOF', [])).to.equal('EOF_')
  })

  it('should append _ if parameter contains EOF', () => {
    expect(getValidHeredocEOF('test', ['param_EOF'])).to.equal('EOF_')
  })

  it('should append __ if bin contains EOF_', () => {
    expect(getValidHeredocEOF('test_EOF_', [])).to.equal('EOF__')
  })

  it('should append __ if parameter contains EOF_', () => {
    expect(getValidHeredocEOF('test_EOF', ['param_EOF_'])).to.equal('EOF__')
  })

  it(`should append _____ if bin contains EOF____`, () => {
    expect(getValidHeredocEOF('test_EOF____test', [])).to.equal('EOF_____')
  })
})

describe('escapeParams', () => {
  it('returns input wrapped in quotes', () => {
    expect(escapeParam('arg1')).to.equal(`'arg1'`)
  })

  it('replaces single quotes with an escaped quote', () => {
    expect(escapeParam("arg1'test")).to.equal(`'arg1'\\''test'`)
  })

  it('replaces all single quotes with an escaped quote', () => {
    expect(escapeParam("arg1'test'test")).to.equal(`'arg1'\\''test'\\''test'`)
  })

  it('replaces initial quote correctly', () => {
    expect(escapeParam("'arg1")).to.equal(`''\\''arg1'`)
  })

  it('replaces trailing quote correctly', () => {
    expect(escapeParam("arg1'")).to.equal(`'arg1'\\'''`)
  })
})
