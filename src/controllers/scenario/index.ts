import {
  Controller,
  Get,
  Path,
  Route,
} from "tsoa";
import config from 'config'
import { exec } from 'child_process'
// import { Scenario } from '../../../types'
import Logger from '../../utils/Logger'

let log = Logger.child({ controller: '/scenario', morello_host: config.get('morello_host') });
const { address } = config.get('morello_host')

@Route('scenario')
export class scenario extends Controller {
  @Get('{id}')
  public async get(@Path() id: string): Promise<any> {
    return ({
      self: await new Promise((resolve) => {
        log.info(`executing ${id} scenario on this host`);

        exec('ls', (error, stdout, stderr) => resolve({
          status: (error || stderr) ? 'error': 'success',
          output: error ? error : stderr ? stderr : stdout,
        }))
      }),
      morello: await new Promise((resolve) => {
        log.info(`executing ${id} scenario on morello host`);

        exec(`ssh ${address} ls`, (error, stdout, stderr) => resolve({
          status: (error || stderr) ? 'error': 'success',
          output: error ? error : stderr ? stderr : stdout,
        }));
      }),
    })
  }
}
