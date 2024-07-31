import { extractEnvs } from '@sirutils/core'

export const ENV = extractEnvs<Sirutils.Env>(env => ({
  adapter: env.SEQL_ADAPTER || 'mysql',
  console: env.CONSOLE || 'normal',
}))

export const BUILDER = Symbol('Base Builder')
export const GENERATED = Symbol('Generated Query')
export const EMPTY = Symbol('EMPTY')

export const AND = Symbol('AND')
export const OR = Symbol('OR')
export const INSERT = Symbol('INSERT')
export const UPDATE = Symbol('UPDATE')

export const CACHEABLE_OPERATIONS = [AND, OR]
