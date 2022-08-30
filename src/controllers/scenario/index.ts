import {
  Controller,
  Get,
  Query,
  Path,
  Route,
} from 'tsoa'
import config from 'config'
import { exec } from 'child_process'
import { IScenario, HostResponse, Executables } from '../../../types'
import Logger from '../../utils/Logger'
import { escapeParam, getValidHeredocEOF, getRandomProcessName } from '../../utils/params'

@Route('scenario')
export class scenario extends Controller implements IScenario {
  address: string
  port: number
  log: typeof Logger

  constructor() {
    super()
    this.address = `${config.get('morello.username')}@${config.get('morello.address')}`
    this.port = config.get('morello.port')
    this.log = Logger.child({ controller: '/scenario', ...config.get('morello') })
  }

  execute(bin: string, params: string[] = []): Promise<HostResponse> {
    params = params.map(p => escapeParam(p))
    const destBin = getRandomProcessName(bin)
    const eof = getValidHeredocEOF(bin, params)

    const scp = `scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -q -P ${this.port} bin/${bin} ${this.address}:/tmp/${destBin}`
    const ssh = `ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -q -p ${this.port} ${this.address} -t <<${eof}
      chmod +x /tmp/${bin};
      /tmp/${destBin} ${params.join(' ')} 2>&1;
      exit;
    ${eof}`
    const rm = `ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -q -p ${this.port} ${this.address} rm -v /tmp/${destBin} &> /dev/null`
    this.log.debug({ msg: `executing ${bin} on ${this.address} host`, scp, ssh })

    return new Promise((resolve) => {
      exec(`${scp}; ${ssh}`, (err, stdout) => {
        exec(rm) // fire and forget, remove binary file
        return resolve({
          status: err ? 'error': 'success',
          output: stdout,
          ...err ? { exception: err } : {}
        })
      })
    })
  }

  @Get('{executable}')
  public async get(@Path() executable: Executables , @Query() params?: string[]): Promise<HostResponse> {
    this.log.debug(`attempting to execute ${executable} scenario with [${params}] arguments`)

    return this.execute(executable, params)
  }
}
