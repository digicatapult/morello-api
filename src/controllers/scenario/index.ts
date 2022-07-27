import {
  Controller,
  Get,
  Path,
  Route,
} from "tsoa";
import { exec } from 'child_process';

import Logger from '../../utils/Logger'


let log = Logger.child({ controller: '/scenario' });

@Route('scenario')
export class scenario extends Controller {
  @Get('{id}')
  public get(@Path() id: string): Promise<Scenario> {
    log.info(`executing ${id} scenario`);

    return new Promise((resolve) => {
      // run program locally
      // [ ] - create an array of programs so more scenarios can be added
      // [ ] - helpeer for running programs
      // [ ] - 
      exec("ls -la", (error, stdout, stderr) => {
        resolve({
          status: (error || stderr || error) ? 'error': 'success',
          output: error ? error.message : stderr ? stderr : stdout,
        });
      })
    })
  }
}

