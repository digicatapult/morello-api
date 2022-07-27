import {
  Controller,
  Get,
  Path,
  Route,
} from "tsoa";

import Logger from '../../utils/Logger'
import { Scenario } from "../../../types"

let log = Logger.child({ controller: '/run' })

@Route('run')
export class Run extends Controller {

  @Get('{id}')
  public get(@Path() id: string): Promise<Scenario> {
    log.info('get example controller', id)
    return Promise.resolve({
      status: 'error',
      output: 'some error',
    })
  }
}

