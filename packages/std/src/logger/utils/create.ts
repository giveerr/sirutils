import picocolors from 'picocolors'
import { capsule } from '../../results'

import { loggerTags } from '../tag'

import { createLog } from './internal/log'
import { createErr } from './internal/err'
import { createWarn } from './internal/warn'

export const create = capsule((options: Std.LoggerOptions) => {
  options.name = options.name.trim()

  const logger = {
    options,

    name: picocolors.bgBlack(picocolors.whiteBright(picocolors.bold(` ${options.name} `))),

    get date() {
      const date = new Date()

      const hour = `${date.getHours()}`.padStart(2, '0')
      const minute = `${date.getMinutes()}`.padStart(2, '0')
      const second = `${date.getSeconds()}`.padStart(2, '0')
      const millisecond = `${date.getMilliseconds()}`.padStart(3, '0')

      const day = `${date.getDate()}`.padStart(2, '0')
      const month = `${date.getMonth() + 1}`.padStart(2, '0')
      const year = `${date.getFullYear()}`

      return picocolors.gray(`${hour}:${minute}:${second}.${millisecond} ${day}/${month}/${year}`)
    },
  } as Std.Logger

  logger.log = createLog(logger)
  logger.err = createErr(logger)
  logger.warn = createWarn(logger)

  return Object.freeze(logger)
}, loggerTags.get('create'))
