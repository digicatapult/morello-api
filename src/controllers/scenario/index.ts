import {
  Controller,
  Get,
  Path,
  Route,
} from "tsoa";
import config from 'config'
import { exec } from 'child_process'
import { ExamplesResult } from '../../../types'
import Logger from '../../utils/Logger'

let log = Logger.child({ controller: '/scenario', morello_host: config.get('morello_host') });

const { address, username } = config.get('morello_host')

@Route('scenario')
export class scenario extends Controller {
  @Get('{id}')
  public async get(@Path() id: string): Promise<ExamplesResult> {
    const cheriBin = `cat ./binaries/${id}-cheri | ssh ${username}@${address} "cat >${id}; chmod +x ${id}; ${id} with args; rm ${id}`
    return ({
      self: await new Promise((resolve) => {
        log.info(`executing ${id} example on self`);

        exec(`./binaries/${id}-aarch64`, (err, stdout, stderr) => resolve({
          status: (err || stderr) ? 'error': 'success',
          output: err ? err : stderr ? stderr : stdout,
        }))
      }),
      morello: await new Promise((resolve) => {
        log.info(`executing ${id} exampole on the morello host`);

        exec(cheriBin, (err, stdout, stderr) => resolve({
          status: (err || stderr) ? 'error': 'success',
          output: err ? err : stderr ? stderr : stdout,
        }));
      }),
    })
  }
}
