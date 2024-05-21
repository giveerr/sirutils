import fs from 'fs'
import path from 'path'
import {
  type CompilationOptions,
  type EntryPointConfig,
  generateDtsBundle,
} from 'dts-bundle-generator'
import { getTsconfig } from 'get-tsconfig'

type Options = Omit<EntryPointConfig, 'filePath'> & {
  compilationOptions?: CompilationOptions
}

export const dts = (options?: Options): import('bun').BunPlugin => {
  return {
    name: 'bun-plugin-dts',
    async setup(build) {
      const { compilationOptions, ...rest } = options || {}

      const entrypoints = [...build.config.entrypoints].sort()
      const entries = entrypoints.map(entry => {
        return {
          filePath: entry,
          ...rest,
        }
      })

      const tsconfig = compilationOptions?.preferredConfigPath ?? getTsconfig()?.path
      const result = generateDtsBundle(entries, {
        ...compilationOptions,
        preferredConfigPath: tsconfig,
      })

      const outDir = build.config.outdir || './dist'
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir)
      }

      await Promise.all(
        entrypoints.map((entry, index) => {
          const dtsFile = entry.replace(/^.*\//, '').replace(/\.[jtm]s$/, '.d.ts')
          const outFile = path.join(outDir, dtsFile)

          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          return Bun.write(outFile, result[index] as any)
        })
      )
    },
  }
}
