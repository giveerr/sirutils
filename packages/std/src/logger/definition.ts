/// <reference path="../shared/index.ts" />
/// <reference path="../results/index.ts" />

import type { BlobType } from '../shared'

import type { loggerTags } from './tag'

declare global {
  namespace Std {
    // ------------ Errors ------------
    interface Error {
      'std/logger': typeof loggerTags
    }

    // ------------ Logger ------------
    interface LoggerOptions {
      name: string
    }

    interface Logger {
      name: string
      rawName: string

      options: Required<Std.LoggerOptions>

      get date(): string

      log: (...args: BlobType[]) => void
      err: (...args: BlobType[]) => void
      warn: (...args: BlobType[]) => void
    }
  }
}
