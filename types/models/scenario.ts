import { ExecException } from 'child_process'
import Logger from '../../src/utils/Logger'

export type Executables =
  | 'out-of-bounds-access-aarch64'
  | 'out-of-bounds-access-cheri'
  | 'out-of-bounds-read-aarch64'
  | 'out-of-bounds-read-cheri'
  | 'out-of-bounds-readV2-aarch64'
  | 'out-of-bounds-readV2-cheri'
  | 'out-of-bounds-write-aarch64'
  | 'out-of-bounds-write-cheri'
  | 'use-after-free-aarch64'
  | 'use-after-free-cheri'

export type HostResponseSuccess = {
  status: 'success'
  output: string
}

export type HostResponseError = {
  status: 'error'
  output: string
  exception: ExecException
}

export type HostResponse = HostResponseSuccess | HostResponseError

export interface IScenario {
  readonly address: string
  readonly port: number
  log: typeof Logger
  get: (executable: Executables, params: string[]) => Promise<HostResponse>
  execute: (cmd: Executables, params: string[]) => Promise<HostResponse>
}
