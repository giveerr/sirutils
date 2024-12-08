import picocolors from 'picocolors'
import { capsule } from '../../../results'
import type { BlobType } from '../../../shared'

import { loggerTags } from '../../tag'

export const createWarn = (logger: Std.Logger) => {
  const mark = picocolors.bgYellow(' warn ')

  return capsule((...args: BlobType[]) => {
    // biome-ignore lint/suspicious/noConsole: Redundant
    console.warn('%s%s', logger.name, mark, ...args, logger.date)
  }, loggerTags.get('warn'))
}
