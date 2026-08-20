import { describe, expect, it } from 'vitest'

import { en } from './en'
import { ptBrOverridesComplete } from './pt-br'

type AnyRecord = Record<string, any>

function missingPaths(active: AnyRecord, base: AnyRecord, prefix = ''): string[] {
  const missing: string[] = []

  for (const key of Object.keys(base)) {
    const path = prefix ? `${prefix}.${key}` : key

    if (!(key in active) || active[key] === undefined) {
      missing.push(path)

      continue
    }

    if (
      base[key] &&
      typeof base[key] === 'object' &&
      !Array.isArray(base[key]) &&
      active[key] &&
      typeof active[key] === 'object' &&
      !Array.isArray(active[key])
    ) {
      missing.push(...missingPaths(active[key], base[key], path))
    }
  }

  return missing
}

describe('pt-BR desktop catalog', () => {
  it('covers every static English catalog path without relying on runtime fallback', () => {
    expect(missingPaths(ptBrOverridesComplete as AnyRecord, en as AnyRecord)).toEqual([])
  })
})
