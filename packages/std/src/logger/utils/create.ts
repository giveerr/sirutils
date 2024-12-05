import { capsule } from '../../results'
import { loggerTags } from '../tag'

export const create = capsule((name: string) => {
  return { name }
}, loggerTags.get('create'))
