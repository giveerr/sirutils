import { join } from 'node:path'
import { wrap } from '@sirutils/core'
import type { Project } from 'ts-morph'

import { toRelativeTsPath } from '../../internal/utils'
import { schemaTags } from '../../tag'

export const generateRootImports = wrap(
  (project: Project, files: Sirutils.Schema.Normalized[], dir: string) => {
    const filePath = join(dir, '_', 'index.ts')

    const sourceFile =
      project.addSourceFileAtPathIfExists(filePath) ??
      project.createSourceFile(filePath, '', {
        overwrite: true,
      })

    const exports = sourceFile
      .getExportDeclarations()
      .filter(exportDeclaration => exportDeclaration.isNamespaceExport())
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      .flatMap(exportDeclaration => exportDeclaration.getModuleSpecifierValue()!)

    const missingExports = files.filter(
      file => !exports.includes(toRelativeTsPath(dir, file.targetPath))
    )

    const redundantExports = exports.filter(
      relativeTsPath =>
        !files.some(file => toRelativeTsPath(dir, file.targetPath) === relativeTsPath)
    )

    // add missing exports
    sourceFile.addExportDeclarations(
      missingExports.map(missingExport => {
        return {
          moduleSpecifier: toRelativeTsPath(dir, missingExport.targetPath),
        }
      })
    )

    // remove redundant exports
    sourceFile
      .getExportDeclarations()
      .filter(
        exportDeclaration =>
          exportDeclaration.isNamespaceExport() &&
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          redundantExports.includes(exportDeclaration.getModuleSpecifierValue()!)
      )
      .map(exportDeclaration => exportDeclaration.remove())
  },
  schemaTags.generateRootImports
)
