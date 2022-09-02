import { Response as ExResponse, Request as ExRequest, NextFunction } from 'express'
import { ValidateError } from 'tsoa'

import logger from './Logger'
import { Executables } from '../../types'

export interface ValidateErrorJSON {
  message: 'Validation failed'
  details: { [name: string]: unknown }
}

export interface ScenarioNotFoundJSON {
  message: 'Scenario could not be executed (not found)'
  scenario: Executables
}

export class ScenarioNotFoundError extends Error {
  public readonly scenario: Executables

  constructor(executable: Executables) {
    super('Scenario could not be executed (not found)')
    this.scenario = executable
  }
}

export const errorHandler = function errorHandler(
  err: unknown,
  req: ExRequest,
  res: ExResponse,
  next: NextFunction
): ExResponse | void {
  if (err instanceof ValidateError) {
    logger.debug(`Handled Validation Error for ${req.path}:`, err.fields)
    const response: ValidateErrorJSON = {
      message: 'Validation failed',
      details: err?.fields,
    }
    return res.status(422).json(response)
  }
  if (err instanceof ScenarioNotFoundError) {
    const response: ScenarioNotFoundJSON = {
      message: 'Scenario could not be executed (not found)',
      scenario: err.scenario,
    }
    return res.status(501).json(response)
  }
  if (err instanceof Error) {
    logger.warn('Unexpected error thrown in handler: %s', err.message)
    return res.status(500).json({
      message: 'Internal Server Error',
    })
  }

  next()
}
