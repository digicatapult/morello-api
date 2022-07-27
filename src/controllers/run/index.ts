import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Route,
  SuccessResponse,
} from "tsoa";

import Logger from '../../utils/Logger'
import { Example } from "../../../types"

let log = Logger.child({ controller: '/run' })

@Route('example')
export class Run extends Controller {

  @Get('{id}')
  public get(@Path() id: string): Promise<Example> {
    log.info('get example controller', id)
    return Promise.resolve({
      id,
      items: ['a', 'b', 'c'],
      status: 'offline',
    })
  }
}

