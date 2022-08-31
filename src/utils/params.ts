const processChars: string = 'abcdefghijklmnopqrstuvwxyz'
export const getRandomProcessName = (bin: string): string => {
  return `${bin}_${Array(10).fill(null).map(_ => processChars[Math.floor(Math.random() * processChars.length)]).join('')}`
}

export const getValidHeredocEOF = (bin: string, params: string[]): string => {
  const fullCmd: string = `/tmp/${bin} ${params.join(' ')}`
  let eof: string = 'EOF'
  while (fullCmd.includes(eof)) {
    eof = `${eof}_`
  }
  return eof
}

export const escapeParam = (param: string): string => {
  return `'${param.replace(/'/g, "'\\''")}'`
}
