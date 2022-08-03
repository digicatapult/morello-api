import {
  Controller,
  Get,
  Path,
  Route,
} from 'tsoa'
import config from 'config'
import { exec } from 'child_process'
import { ExamplesResult, IScenario, HostResponse, Executables } from '../../../types'
import Logger from '../../utils/Logger'

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


  execute(bin: string): Promise<HostResponse> {
    const scp = `scp -P ${this.port} bin/${bin} ${this.address}:/tmp`
    const ssh = `ssh -p ${this.port} ${this.address} -tt 'chmod +x /tmp/${bin}; /tmp/${bin} with args' 2>&1`
    const rm = `ssh -p ${this.port} ${this.address} rm -v /tmp/${bin} &> /dev/null`
    this.log.debug({ msg: `executing ${bin} on ${this.address} host`, scp, ssh })

    return new Promise((resolve) => {
      exec(`${scp}; ${ssh}`, (err, stdout) => {
        exec(rm)
        return resolve({
          status: err ? 'error': 'success',
          output: stdout,
          ...err ? { exception: err } : {}
        })
      })
    })
  }
  
  @Get('{executable}')
  public async get(@Path() executable: Executables): Promise<ExamplesResult> {
    this.log.debug(`attempting to execute ${executable} scenario`)
    
    return ({
      cheri: await this.execute(`${executable}-cheri`),
      aarch64: await this.execute(`${executable}-aarch64`),
    })
  }
}
