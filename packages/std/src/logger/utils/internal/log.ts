import picocolors from 'picocolors'
import { capsule } from '../../../results'
import type { BlobType } from '../../../shared'

import { loggerTags } from '../../tag'

export const createLog = (logger: Std.Logger) => {
  const mark = picocolors.bgCyan(' log ')

  return capsule((...args: BlobType[]) => {
    // biome-ignore lint/suspicious/noConsole: Redundant
    console.log('%s%s', logger.name, mark, ...args, logger.date)
  }, loggerTags.get('log'))
}
