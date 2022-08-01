import {
  Controller,
  Get,
  Path,
  Route,
} from "tsoa";
import config from 'config';
import { exec } from 'child_process';
// import { Scenario } from '../../../types'
import Logger from '../../utils/Logger';

let log = Logger.child({ controller: '/scenario', morello_host: config.get('morello_host') });

@Route('scenario')
export class scenario extends Controller {
  @Get('{id}')
  public async get(@Path() id: string): Promise<any> {
    log.info(`copying ${id} scenario onto morello host ${config.get('morello_host.address')}`)
    await new Promise((resolve) => {
      exec("scp ../../../examples/tmp.bin", (error, stdout, stderr) => {
        if (error || stderr) {
          log.error({ error, stderr })
          throw new Error(`copying ${id} binaries has failed.`)
        } 
        log.info('binaries file has been copied')
        resolve(stdout)
      });
    })
  
    return ({
      self: await new Promise((resolve) => {
        log.info(`executing ${id} scenario on this host`);
        exec("ls -la", (error, stdout, stderr) => {
          resolve({
            status: (error || stderr || error) ? 'error': 'success',
            output: error ? error.message : stderr ? stderr : stdout,
          });
        });
      }),
      morello: await new Promise((resolve) => {
        log.info(`executing ${id} scenario on morello host`);
        exec("ls -la", (error, stdout, stderr) => {
          resolve({
            status: (error || stderr || error) ? 'error': 'success',
            output: error ? error.message : stderr ? stderr : stdout,
          });
        })
      })
    })
  }
}
