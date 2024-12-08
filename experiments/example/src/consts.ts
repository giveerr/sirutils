import { extractEnvs } from '@sirutils/std/io'
import { create } from '@sirutils/std/logger'

export const ENV = extractEnvs(env => ({
  host: env.HOST,
}))

export const logger = create({
  name: 'example',
})
