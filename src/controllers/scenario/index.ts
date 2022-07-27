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

    return new Promise((resolve, reject) => {
      exec("ls -la", (error, stdout, stderr) => {
        if (error) reject({
          status: 'error',
          output: error,
        })

        resolve({
          status: stderr ? 'error': 'success',
          output: stderr ? stderr : stdout,
        });
      })
    })
  }
}

