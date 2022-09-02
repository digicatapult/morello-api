const processChars = 'abcdefghijklmnopqrstuvwxyz'
export const getRandomProcessName = (bin: string): string => {
  return `${bin}_${Array(10)
    .fill(null)
    .map(() => processChars[Math.floor(Math.random() * processChars.length)])
    .join('')}`
}

export const getValidHeredocEOF = (bin: string, params: string[]): string => {
  const fullCmd = `/tmp/${bin} ${params.join(' ')}`
  let eof = 'EOF'
  while (fullCmd.includes(eof)) {
    eof = `${eof}_`
  }
  return eof
}

export const escapeParam = (param: string): string => {
  return `'${param.replace(/'/g, "'\\''")}'`
}
