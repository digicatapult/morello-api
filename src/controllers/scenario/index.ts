import {
  Controller,
  Get,
  Path,
  Route,
} from "tsoa";
import { exec } from 'child_process';

import Logger from '../../utils/Logger'


let log = Logger.child({ controller: '/scenario' });

@Route('run')
export class scenario extends Controller {
  @Get('{id}')
  public get(@Path() id: string): Promise<Scenario> {
    log.info(`executing ${id} scenario`);

    return new Promise((resolve) => {
      exec("ls -la", (error, stdout, stderr) => {
        resolve({
          status: (error || stderr || error) ? 'error': 'success',
          output: error ? error.message : stderr ? stderr : stdout,
        });
      })
    })
  }
}

