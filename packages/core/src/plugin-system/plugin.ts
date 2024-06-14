import { nanoid } from 'nanoid'

import { ProjectError } from '../result/error'
import { pluginSystemTags } from '../tag'
import type { BlobType } from '../utils/common'
import { createContext } from './context'
import { logger } from '../internal/logger'
import type { Spreadable } from 'type-fest/source/spread'

export const createPlugin = <const O, const R extends Spreadable>(
  meta: Sirutils.PluginSystem.Meta,
  pluginInitiator: (app: Sirutils.PluginSystem.App) => R,
  cause: Sirutils.ErrorValues,
  defaultOptions?: O
) => {
  const apis: Sirutils.PluginSystem.Action[] = []

  const plugin = ((rawOptions?: O) => {
    const $id = `${meta.name}@${meta.version}-${nanoid()}`

    const pluginContext = createContext(
      (
        context: Sirutils.PluginSystem.Definition<O, R>,
        app?: Sirutils.PluginSystem.App,
        options?: O
      ) => {
        if (app && !context.$boundApps.includes(app)) {
          context.$boundApps.push(app)
        }

        if (options && !Object.hasOwn(context, 'options')) {
          context.options = options
        }

        if (context.$boundApps.length === 0) {
          throw ProjectError.create(
            pluginSystemTags.pluginNotInitialized,
            'usePluginContext dont have any bound app'
          ).appendCause(cause)
        }
      },
      cause,
      {
        meta,

        $id,
        $boundApps: [],
      } as BlobType
    )

    const options: O | undefined = rawOptions
      ? { ...(defaultOptions ?? {}), ...rawOptions }
      : undefined

    const pluginInstance = (app: Sirutils.PluginSystem.App) => {
      pluginContext.init(app, options)
      pluginContext.api = Object.assign(
        {},
        pluginInitiator(app),
        ...apis.map(actionInitiator => actionInitiator(app, cause))
      )

      return pluginContext
    }

    pluginInstance.context = pluginContext

    return pluginInstance
  }) as unknown as Sirutils.PluginSystem.Plugin<O, R>

  plugin.register = actionInitiator => {
    if (apis.includes(actionInitiator)) {
      logger.warn('actionInitiator registered some actions twice')
    } else {
      apis.push(actionInitiator)
    }

    return plugin as BlobType
  }

  return plugin
}
