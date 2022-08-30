import { ExecException } from 'child_process'
import Logger from '../../src/utils/Logger'

export type Executables =
  'out-of-bounds-read-aarch64' |
  'out-of-bounds-read-cheri' |
  'out-of-bounds-write-aarch64' |
  'out-of-bounds-write-cheri'

export type HostResponse = {
  status: 'success' | 'error' | 'exception',
  output: string,
  exception?: ExecException,
}

export interface IScenario {
  readonly address: string
  readonly port: number
  log: typeof Logger
  get: (executable: Executables, params: string[]) => Promise<HostResponse>
  execute: (cmd: string, params: string[]) => Promise<HostResponse>
}
