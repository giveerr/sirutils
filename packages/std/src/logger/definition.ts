/// <reference path="../shared/index.ts" />
/// <reference path="../results/index.ts" />

import type { loggerTags } from './tag'

declare global {
  namespace Std {
    // ------------ Errors ------------
    interface Error {
      'std/logger': typeof loggerTags
    }
  }
}
