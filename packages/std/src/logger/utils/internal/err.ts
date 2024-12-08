import picocolors from 'picocolors'
import { capsule } from '../../../results'
import type { BlobType } from '../../../shared'

import { loggerTags } from '../../tag'

export const createErr = (logger: Std.Logger) => {
  const mark = picocolors.bgRed(' err ')

  return capsule((...args: BlobType[]) => {
    // biome-ignore lint/suspicious/noConsole: Redundant
    console.error('%s%s', logger.name, mark, ...args, logger.date)
  }, loggerTags.get('err'))
}
