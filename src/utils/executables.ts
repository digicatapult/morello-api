import fs from 'fs/promises'

import logger from './Logger'
import { Executables } from '../types'

const validExecutables: Executables[] = [
  'out-of-bounds-access-aarch64',
  'out-of-bounds-access-cheri',
  'out-of-bounds-read-aarch64',
  'out-of-bounds-read-cheri',
  'out-of-bounds-readV2-aarch64',
  'out-of-bounds-readV2-cheri',
  'out-of-bounds-write-aarch64',
  'out-of-bounds-write-cheri',
  'use-after-free-aarch64',
  'use-after-free-cheri',
]

export const validateExecutables = async () => {
  for (const executableName of validExecutables) {
    try {
      await fs.stat(`bin/${executableName}`)
    } catch (err) {
      logger.warn(`Executable ${executableName} could not be found`)
    }
  }
}

export const checkExecutable = async (executableName: string): Promise<boolean> => {
  try {
    await fs.stat(`bin/${executableName}`)
    return true
  } catch (err) {
    return false
  }
}
