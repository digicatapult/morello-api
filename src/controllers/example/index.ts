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
import { Example, ExampleRequestParams } from "../../../types"

let log = Logger.child({ controller: '/example' })

@Route('example')
export class ExampleController extends Controller {

  @Get('{id}')
  public get(@Path() id: string): Promise<Example> {
    log.info('get example controller')
    return Promise.resolve({
      id,
      items: ['a', 'b', 'c'],
      status: 'offline',
    })
  }
  
  @SuccessResponse('201', 'Created' )
  @Post()
  public create(@Body() data: ExampleRequestParams): Promise<boolean> {
    log.info({ action: 'create', data })
    this.setStatus(201) // TODO learn abouyt this .setStatus
    return Promise.resolve(true)
  }
}
