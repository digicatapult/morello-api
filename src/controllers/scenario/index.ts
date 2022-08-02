import {
  Controller,
  Get,
  Path,
  Route,
} from 'tsoa'
import config from 'config'
import { exec } from 'child_process'
import { ExamplesResult, IScenario, HostResponse } from '../../../types'
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

  execute(cmd: string): Promise<HostResponse> {
    this.log.info(`executing ${cmd}`)

    return new Promise((resolve) => {
      exec(cmd, (err, stdout, stderr) => resolve({
        status: (err || stderr) ? 'error': 'success',
        output: err ? err : stderr ? stderr : stdout,
      }))
    })
  }
  
  @Get('{id}')
  public async get(@Path() id: string): Promise<ExamplesResult> {
    this.log.info(`attempting to execute ${id} scenario`)
    // TODO - example validation, return 404 or something if it does not exists
    // - helper for executing commands (exec)
    // - helper for getting the binary files

    // const cheriBin = `cat ./binaries/${id}-cheri | ssh ${address} -p 2222 "cat >${id}; chmod +x ${id}; ${id} with args; rm ${id}`
    const morelloCmd = `ssh -p ${this.port} ${this.address} 'ls -la'`
    const basicCmd = 'ls -la'

    return ({
      self: await this.execute(basicCmd),
      morello: await this.execute(morelloCmd) 
    })
  }
}
