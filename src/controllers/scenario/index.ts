import {
  Controller,
  Get,
  Path,
  Route,
} from "tsoa";

import Logger from '../../utils/Logger'

let log = Logger.child({ controller: '/scenario' });

@Route('run')
export class scenario extends Controller {

  @Get('{id}')
  public get(@Path() id: string): Promise<Scenario> {
    log.info(`executing ${id} scenario`);

    return Promise.resolve({
      status: 'error',
      output: 'some error',
    });
  }
}

