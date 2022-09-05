import { Controller, Get, Query, Path, Route, Response } from 'tsoa'
import config from 'config'
import { exec } from 'child_process'
import { IScenario, HostResponse, Executables } from '../../types'
import Logger from '../../utils/Logger'
import * as paramUtil from '../../utils/params'
import * as execUtil from '../../utils/executables'
import { ValidateErrorJSON, ScenarioNotFoundJSON, ScenarioNotFoundError } from '../../utils/errors'

@Route('scenario')
export class scenario extends Controller implements IScenario {
  address: string
  port: number
  log: typeof Logger

  constructor() {
    super()
    this.address = `${config.get('morello.username')}@${config.get('morello.host')}`
    this.port = config.get('morello.port')
    this.log = Logger.child({ controller: '/scenario', ...config.get('morello') })
  }

  async execute(bin: Executables, params: string[] = []): Promise<HostResponse> {
    if (!(await execUtil.checkExecutable(bin))) {
      throw new ScenarioNotFoundError(bin)
    }

    params = params.map((p) => paramUtil.escapeParam(p))
    const destBin = paramUtil.getRandomProcessName(bin)
    const eof = paramUtil.getValidHeredocEOF(bin, params)

    const scp = `scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -q -P ${this.port} bin/${bin} ${this.address}:/tmp/${destBin}`
    const ssh = `ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -q -p ${this.port} ${
      this.address
    } -t << '${eof}'
chmod +x /tmp/${bin};
/tmp/${destBin} ${params.join(' ')} 2>&1;
exit;
${eof}`

    const rm = `ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -q -p ${this.port} ${this.address} rm -v /tmp/${destBin} &> /dev/null`
    this.log.debug({ msg: `executing ${bin} on ${this.address} host`, scp, ssh })

    return new Promise((resolve) => {
      exec(`${scp}; ${ssh}`, (err, stdout) => {
        exec(rm) // fire and forget, remove binary file
        return resolve(
          err
            ? {
                status: 'error',
                output: stdout,
                exception: err,
              }
            : {
                status: 'success',
                output: stdout,
              }
        )
      })
    })
  }

  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Response<ScenarioNotFoundJSON>(501, 'Error executing scenario (not found)')
  @Get('{executable}')
  public async get(@Path() executable: Executables, @Query() params?: string[]): Promise<HostResponse> {
    this.log.debug(`attempting to execute ${executable} scenario with [${params}] arguments`)

    return this.execute(executable, params)
  }
}
