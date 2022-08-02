import { ExecException } from 'child_process'
import Logger from '../../src/utils/Logger'

// todo if it gets bigger group in models/ folder by entity and import here or ambient namescapes
export type HostResponse = {
  status: 'success' | 'error',
  output: string | ExecException, 
}

export interface IScenario {
  readonly address: string
  readonly port: number
  log: typeof Logger
  get: (id: string) => Promise<ExamplesResult>
  execute: (cmd: string) => Promise<HostResponse>
}

export interface ExamplesResult {
  morello: HostResponse,
  self: HostResponse,
}
